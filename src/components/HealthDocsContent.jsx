"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaFileAlt,
  FaDownload,
  FaEye,
  FaCalendarAlt,
  FaChartLine,
} from "react-icons/fa";

export default function HealthDocsContent() {
  // Server base for Node/Express API
  const NODE_BASE = useMemo(
    () => process.env.NEXT_PUBLIC_NODE_API_BASE || "http://localhost:3001",
    []
  );
  // Flask OCR base (defaults to 5001 like predict page)
  const FLASK_BASE = useMemo(
    () => process.env.NEXT_PUBLIC_FLASK_API_BASE || "http://localhost:5001",
    []
  );

  // Defensive: ensure absolute base URLs and no trailing slashes
  const nodeBaseSanitized = useMemo(() => {
    const deflt = "http://localhost:3001";
    const val = NODE_BASE || deflt;
    try {
      const u = new URL(val);
      return u.origin.replace(/\/$/, "");
    } catch {
      // relative like '/' -> fallback
      return deflt;
    }
  }, [NODE_BASE]);

  const flaskBaseSanitized = useMemo(() => {
    const deflt = "http://localhost:5001";
    const val = FLASK_BASE || deflt;
    try {
      const u = new URL(val);
      return u.origin.replace(/\/$/, "");
    } catch {
      return deflt;
    }
  }, [FLASK_BASE]);

  // Parsed medical docs from backend
  const [documents, setDocuments] = useState([]);

  const [healthMetrics, setHealthMetrics] = useState({
    currentBMI: 22.5,
    weeklyCalorieAvg: 2150,
    exerciseHours: 5.5,
    waterIntake: 2.1,
  });

  // Upload/OCR state
  const [file, setFile] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch stored docs from backend
  const fetchDocs = async () => {
    try {
      const res = await fetch(`${nodeBaseSanitized}/api/docs`, {
        credentials: "include",
      });
      if (res.status === 401) {
        // Not logged in
        setDocuments([]);
        return;
      }
      if (!res.ok) throw new Error(`Failed to fetch docs: ${res.status}`);
      const data = await res.json();
      const docs = Array.isArray(data.docs) ? data.docs : [];
      setDocuments(docs);
    } catch (e) {
      console.error("/api/docs error", e);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  // OCR extraction: try server-side first (Flask), fallback to client-only
  const extractTextFromFile = async (f) => {
    if (!f) return "";
    const type = f.type || "";
    // Try server OCR for PDF/image
    try {
      const form = new FormData();
      form.append("file", f);
      const resp = await fetch(`${flaskBaseSanitized}/ocr-extract`, {
        method: "POST",
        body: form,
      });
      if (resp.ok) {
        const data = await resp.json();
        if (typeof data?.text === "string" && data.text.trim().length > 0) {
          return data.text.trim();
        }
      }
    } catch (err) {
      // Silent fallback to client OCR below
      console.warn("Server OCR failed, falling back to client OCR", err);
    }

    // Client fallback: PDFs via pdfjs (first page), images via tesseract.js
    if (type.includes("pdf")) {
      // Use legacy build to avoid worker.entry resolution in Next/Turbopack
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf");
      try {
        // Serve worker locally to avoid external CDN/Zero Trust prompts
        // eslint-disable-next-line camelcase
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";
      } catch (e) {
        // Continue if not available; some envs might still function
      }
      const arrayBuf = await f.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuf }).promise;
      const page = await pdf.getPage(1);
      const content = await page.getTextContent();
      const strings = content.items?.map((it) => it.str) || [];
      return strings.join(" ").trim();
    }
    if (type.startsWith("image/")) {
      const Tesseract = (await import("tesseract.js")).default;
      const { data } = await Tesseract.recognize(f, "eng");
      return (data?.text || "").trim();
    }
    // Fallback: attempt to read as text
    return await f.text();
  };

  const handleFileChange = async (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setOcrText("");
    setOcrError(null);
  };

  const handleOcr = async () => {
    if (!file) {
      setOcrError("Please choose a file (PDF or image)");
      return;
    }
    try {
      setIsOcrLoading(true);
      setOcrError(null);
      const text = await extractTextFromFile(file);
      if (!text || text.length < 10) {
        throw new Error("No readable text detected – try a clearer scan");
      }
      setOcrText(text);
    } catch (e) {
      console.error("OCR error", e);
      setOcrError(e.message || "OCR failed");
    } finally {
      setIsOcrLoading(false);
    }
  };

  const handleUploadParse = async () => {
    if (!ocrText || ocrText.length < 10) {
      setUploadError("Run OCR first or paste text manually");
      return;
    }
    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await fetch(`${nodeBaseSanitized}/api/upload-doc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: ocrText, filename: file?.name || null }),
      });
      if (res.status === 401) {
        throw new Error("Please log in to upload documents");
      }
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Upload failed ${res.status}`);
      }
      await fetchDocs();
      setOcrText("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      console.error("upload-doc error", e);
      setUploadError(e.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Health Documents
          </h1>
          <p className="text-gray-600">
            View and download your health reports, nutrition analyses, and
            progress tracking documents
          </p>
        </div>

        {/* Quick Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <FaChartLine className="text-blue-500 text-xl mr-3" />
              <div>
                <p className="text-sm text-gray-600">Current BMI</p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthMetrics.currentBMI}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <span className="text-green-500 text-xl mr-3">🔥</span>
              <div>
                <p className="text-sm text-gray-600">Avg Calories/Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthMetrics.weeklyCalorieAvg}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <span className="text-purple-500 text-xl mr-3">💪</span>
              <div>
                <p className="text-sm text-gray-600">Exercise (hrs/week)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthMetrics.exerciseHours}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <span className="text-cyan-500 text-xl mr-3">💧</span>
              <div>
                <p className="text-sm text-gray-600">Water (L/day)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {healthMetrics.waterIntake}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload & Parse */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Upload medical document
            </h2>
            <p className="text-gray-500 text-sm">
              Supported: PDF (first page text) or images (PNG/JPG). Your text is
              parsed by Gemini on the server.
            </p>
          </div>
          <div className="p-6 space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700"
            />
            <div className="flex gap-2">
              <button
                onClick={handleOcr}
                disabled={isOcrLoading || !file}
                className={`px-4 py-2 rounded-lg text-white ${
                  isOcrLoading || !file
                    ? "bg-gray-300"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isOcrLoading ? "Running OCR…" : "Run OCR"}
              </button>
              <button
                onClick={handleUploadParse}
                disabled={isUploading || !ocrText}
                className={`px-4 py-2 rounded-lg text-white ${
                  isUploading || !ocrText
                    ? "bg-gray-300"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isUploading ? "Uploading…" : "Upload & Parse"}
              </button>
            </div>
            {(ocrError || uploadError) && (
              <div className="text-red-600 text-sm">
                {ocrError || uploadError}
              </div>
            )}
            {ocrText && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OCR Text (editable)
                </label>
                <textarea
                  value={ocrText}
                  onChange={(e) => setOcrText(e.target.value)}
                  rows={6}
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaFileAlt className="mr-2 text-blue-500" />
                Your Health Documents
              </h2>
              <button
                onClick={fetchDocs}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id || doc.created_at}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FaFileAlt className="text-blue-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {doc.filename ||
                          doc.parsed?.patient?.name ||
                          "Medical Document"}
                      </h3>
                      <div className="text-sm text-gray-600">
                        {doc.parsed?.date && (
                          <div className="flex items-center text-xs text-gray-500">
                            <FaCalendarAlt className="mr-1" />
                            {doc.parsed.date}
                          </div>
                        )}
                        {Array.isArray(doc.parsed?.diagnoses) &&
                          doc.parsed.diagnoses.length > 0 && (
                            <div className="mt-1">
                              <span className="font-medium">Diagnoses:</span>{" "}
                              {doc.parsed.diagnoses.join(", ")}
                            </div>
                          )}
                        {Array.isArray(doc.parsed?.medications) &&
                          doc.parsed.medications.length > 0 && (
                            <div className="mt-1">
                              <span className="font-medium">Medications:</span>
                              <ul className="list-disc ml-5">
                                {doc.parsed.medications.map((m, i) => (
                                  <li key={i}>
                                    {m.name}
                                    {m.dosage ? ` ${m.dosage}` : ""}
                                    {m.frequency ? ` – ${m.frequency}` : ""}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        {Array.isArray(doc.parsed?.labs) &&
                          doc.parsed.labs.length > 0 && (
                            <div className="mt-1">
                              <span className="font-medium">Labs:</span>
                              <ul className="list-disc ml-5">
                                {doc.parsed.labs.map((l, i) => (
                                  <li key={i}>
                                    {l.name}
                                    {l.value ? `: ${l.value}` : ""}
                                    {l.unit ? ` ${l.unit}` : ""}
                                    {l.reference
                                      ? ` (ref: ${l.reference})`
                                      : ""}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        {doc.parsed?.notes && (
                          <div className="mt-1">
                            <span className="font-medium">Notes:</span>{" "}
                            {doc.parsed.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2"></div>
                </div>
              ))}
            </div>

            {/* Empty State Message */}
            {documents.length === 0 && (
              <div className="text-center py-12">
                <FaFileAlt className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No documents yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Upload a PDF or image to parse medical data into your profile
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Upload a document
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

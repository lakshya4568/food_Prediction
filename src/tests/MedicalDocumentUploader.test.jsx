import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MedicalDocumentUploader from '../components/MedicalDocumentUploader';

// Mock file for testing
const createMockFile = (name, size, type) => {
  const file = new File(['mock content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('MedicalDocumentUploader', () => {
  let mockOnFileUpload;
  let mockOnFileRemove;

  beforeEach(() => {
    mockOnFileUpload = vi.fn();
    mockOnFileRemove = vi.fn();
  });

  it('renders correctly with default props', () => {
    render(
      <MedicalDocumentUploader 
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
      />
    );

    expect(screen.getByText('Upload Medical Documents')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop your files here, or click to browse')).toBeInTheDocument();
    expect(screen.getByText('Supports PDF and PNG files up to 10MB')).toBeInTheDocument();
  });

  it('validates file types correctly', async () => {
    render(
      <MedicalDocumentUploader 
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
      />
    );

    const fileInput = screen.getByRole('textbox', { hidden: true });
    const invalidFile = createMockFile('test.txt', 1024, 'text/plain');

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByText('Upload Errors')).toBeInTheDocument();
      expect(screen.getByText(/Invalid file type/)).toBeInTheDocument();
    });

    expect(mockOnFileUpload).not.toHaveBeenCalled();
  });

  it('validates file size correctly', async () => {
    render(
      <MedicalDocumentUploader 
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
      />
    );

    const fileInput = screen.getByRole('textbox', { hidden: true });
    const oversizedFile = createMockFile('large.pdf', 11 * 1024 * 1024, 'application/pdf'); // 11MB

    fireEvent.change(fileInput, { target: { files: [oversizedFile] } });

    await waitFor(() => {
      expect(screen.getByText('Upload Errors')).toBeInTheDocument();
      expect(screen.getByText(/exceeds the 10MB limit/)).toBeInTheDocument();
    });

    expect(mockOnFileUpload).not.toHaveBeenCalled();
  });

  it('accepts valid PDF files', async () => {
    render(
      <MedicalDocumentUploader 
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
      />
    );

    const fileInput = screen.getByRole('textbox', { hidden: true });
    const validPdfFile = createMockFile('medical-report.pdf', 2 * 1024 * 1024, 'application/pdf'); // 2MB

    fireEvent.change(fileInput, { target: { files: [validPdfFile] } });

    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledTimes(1);
      expect(mockOnFileUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'medical-report.pdf',
          type: 'application/pdf',
          status: 'ready'
        })
      );
    });

    expect(screen.getByText('Uploaded Files (1)')).toBeInTheDocument();
    expect(screen.getByText('medical-report.pdf')).toBeInTheDocument();
  });

  it('accepts valid PNG files', async () => {
    render(
      <MedicalDocumentUploader 
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
      />
    );

    const fileInput = screen.getByRole('textbox', { hidden: true });
    const validPngFile = createMockFile('lab-result.png', 1 * 1024 * 1024, 'image/png'); // 1MB

    fireEvent.change(fileInput, { target: { files: [validPngFile] } });

    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledTimes(1);
      expect(mockOnFileUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'lab-result.png',
          type: 'image/png',
          status: 'ready'
        })
      );
    });

    expect(screen.getByText('Uploaded Files (1)')).toBeInTheDocument();
    expect(screen.getByText('lab-result.png')).toBeInTheDocument();
  });

  it('handles file removal correctly', async () => {
    render(
      <MedicalDocumentUploader 
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
      />
    );

    const fileInput = screen.getByRole('textbox', { hidden: true });
    const validFile = createMockFile('test.pdf', 1024, 'application/pdf');

    // Upload a file first
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(screen.getByText('Uploaded Files (1)')).toBeInTheDocument();
    });

    // Remove the file
    const removeButton = screen.getByTitle('Remove file');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(mockOnFileRemove).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Uploaded Files (1)')).not.toBeInTheDocument();
    });
  });

  it('handles drag and drop events', () => {
    render(
      <MedicalDocumentUploader 
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
      />
    );

    const dropArea = screen.getByText('Upload Medical Documents').closest('div');

    // Test drag enter
    fireEvent.dragEnter(dropArea);
    expect(dropArea).toHaveClass('border-primary-500');

    // Test drag leave
    fireEvent.dragLeave(dropArea);
    expect(dropArea).not.toHaveClass('border-primary-500');
  });

  it('displays processing state correctly', () => {
    render(
      <MedicalDocumentUploader 
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
        isProcessing={true}
      />
    );

    expect(screen.getByText('Processing documents...')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { hidden: true })).toBeDisabled();
  });

  it('clears errors when clear button is clicked', async () => {
    render(
      <MedicalDocumentUploader 
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
      />
    );

    const fileInput = screen.getByRole('textbox', { hidden: true });
    const invalidFile = createMockFile('test.txt', 1024, 'text/plain');

    // Generate an error
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByText('Upload Errors')).toBeInTheDocument();
    });

    // Clear the errors
    const clearButton = screen.getByRole('button', { name: '' }); // Clear button with FaTimes icon
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.queryByText('Upload Errors')).not.toBeInTheDocument();
    });
  });

  it('handles multiple file uploads correctly', async () => {
    render(
      <MedicalDocumentUploader 
        onFileUpload={mockOnFileUpload}
        onFileRemove={mockOnFileRemove}
      />
    );

    const fileInput = screen.getByRole('textbox', { hidden: true });
    const file1 = createMockFile('report1.pdf', 1024, 'application/pdf');
    const file2 = createMockFile('result2.png', 2048, 'image/png');

    fireEvent.change(fileInput, { target: { files: [file1, file2] } });

    await waitFor(() => {
      expect(mockOnFileUpload).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Uploaded Files (2)')).toBeInTheDocument();
      expect(screen.getByText('report1.pdf')).toBeInTheDocument();
      expect(screen.getByText('result2.png')).toBeInTheDocument();
    });
  });
});

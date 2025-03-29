import mimetypes
import typing as tp
from pathlib import Path

from .load_docx import DocxLoader
from .load_jsonl import JsonLoader
from .load_markdown import MarkdownLoader
from .load_pdf import PdfLoader
from .load_pptx import PptxLoader
from .load_xlsx import ExcelLoader

# Import the FileType enum from the existing code
from ._base import FileType, UploadFile


class DocumentLoaderError(Exception):
    """Custom exception for document loading errors."""

    pass


class AnyDocs:
    """
    A flexible document loader that detects file type and extracts content.

    Supports loading from:
    - Local file paths
    - URLs
    - HTTP responses
    """

    @classmethod
    def _guess_file_type_from_mimetype(cls, mimetype: str) -> tp.Optional[str]:
        """
        Convert mimetype to file suffix.

        Args:
            mimetype: MIME type string

        Returns:
            Corresponding file suffix or None
        """
        mimetype = mimetype.lower()
        mimetype_to_suffix = {
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": FileType.DOCX,
            "application/msword": FileType.DOC,
            "application/pdf": FileType.PDF,
            "application/vnd.openxmlformats-officedocument.presentationml.presentation": FileType.PPTX,
            "application/vnd.ms-powerpoint": FileType.PPT,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": FileType.XLSX,
            "application/vnd.ms-excel": FileType.XLS,
            "application/json": FileType.JSON,
            "text/markdown": FileType.MD,
            "text/plain": FileType.TXT,
            "text/html": FileType.HTML,
            "text/css": FileType.CSS,
            "application/javascript": FileType.JS,
        }

        return mimetype_to_suffix.get(mimetype)

    @classmethod
    def _detect_file_type(cls, file_path: Path) -> str:
        """
        Detect file type using multiple methods.

        Args:
            file_path: Path to the file

        Returns:
            File suffix

        Raises:
            DocumentLoaderError if file type cannot be determined
        """
        # 1. Check file extension first
        if file_path.suffix:
            # Normalize the suffix to match FileType
            suffix = file_path.suffix.lower()
            normalized_suffixes = {
                ".doc": FileType.DOCX,
                ".docx": FileType.DOCX,
                ".pdf": FileType.PDF,
                ".ppt": FileType.PPTX,
                ".pptx": FileType.PPTX,
                ".xls": FileType.XLSX,
                ".xlsx": FileType.XLSX,
                ".json": FileType.JSON,
                ".jsonl": FileType.JSON,
                ".md": FileType.MD,
                ".txt": FileType.TXT,
                ".html": FileType.HTML,
                ".css": FileType.CSS,
                ".js": FileType.JS,
            }
            if suffix in normalized_suffixes:
                return normalized_suffixes[suffix]

        # 2. Try mimetypes package
        mimetype, _ = mimetypes.guess_type(str(file_path))
        if mimetype:
            guessed_type = cls._guess_file_type_from_mimetype(mimetype)
            if guessed_type:
                return guessed_type

        # 3. Try reading file content (if file is open-able)
        try:
            with open(file_path, "rb") as f:
                # Read first few bytes to detect file type
                header = f.read(16)

                # PDF magic number
                if header.startswith(b"%PDF-"):
                    return FileType.PDF

                # DOCX magic number
                if header.startswith(b"PK\x03\x04") and b"word/" in header:
                    return FileType.DOCX

                # XLSX magic number
                if header.startswith(b"PK\x03\x04") and b"xl/" in header:
                    return FileType.XLSX

                # PPTX magic number
                if header.startswith(b"PK\x03\x04") and b"ppt/" in header:
                    return FileType.PPTX
        except Exception:
            return FileType.PDF

        # If all methods fail
        raise DocumentLoaderError(f"Could not determine file type for {file_path}")

    @classmethod
    def load(
        cls, file: tp.Union[str, Path, UploadFile]
    ) -> tp.Generator[str, None, None]:
        """
        Load and extract text from a document based on its type.

        Args:
            file: A file path, URL, or UploadFile object

        Returns:
            A generator yielding text chunks from the document

        Raises:
            DocumentLoaderError: If the file type is unsupported
        """
        # Handle UploadFile directly
        if isinstance(file, UploadFile):
            try:
                file_suffix = file.suffix
            except ValueError:
                raise DocumentLoaderError(f"Could not determine file type for {file}")
        else:
            # Convert to Path if it's a string
            file_path = Path(file)

            # Detect file type
            file_suffix = cls._detect_file_type(file_path)

        # Map file types to loader classes
        loaders = {
            FileType.DOCX.value: DocxLoader,
            FileType.DOC.value: DocxLoader,
            FileType.PDF.value: PdfLoader,
            FileType.PPTX.value: PptxLoader,
            FileType.PPT.value: PptxLoader,
            FileType.XLSX.value: ExcelLoader,
            FileType.XLS.value: ExcelLoader,
            FileType.JSON.value: JsonLoader,
            FileType.MD.value: MarkdownLoader,
            FileType.TXT.value: MarkdownLoader,  # Assuming TXT can be loaded like markdown
            FileType.HTML.value: MarkdownLoader,  # Basic text extraction
            FileType.CSS.value: MarkdownLoader,  # Basic text extraction
            FileType.JS.value: MarkdownLoader,  # Basic text extraction
        }

        # Get the appropriate loader
        loader_class = loaders.get(file_suffix)

        if loader_class is None:
            raise DocumentLoaderError(f"Unsupported file type: {file_suffix}")

        # Create and use the loader
        return loader_class(str(file)).extract()


# Maintain backwards compatibility
def load_document(
    file: tp.Union[str, Path, UploadFile],
) -> tp.Generator[str, None, None]:
    """
    Backwards-compatible function using the new DocumentLoader.

    Args:
        file: A file path or URL to load

    Returns:
        A generator yielding text chunks from the document

    Raises:
        DocumentLoaderError: If the file type is unsupported
    """
    return AnyDocs.load(file)

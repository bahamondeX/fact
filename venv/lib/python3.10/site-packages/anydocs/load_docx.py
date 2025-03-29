from dataclasses import dataclass

from docx import Document
import typing_extensions as tpe
from pathlib import Path
import base64
from ._base import Artifact


@dataclass
class DocxLoader(Artifact):
    ref: tpe.Annotated[
        str,
        tpe.Doc(
            """
	This `ref` can represent one out of three things:

	- An HTTP URL.
	- A file path (temporary or not) within the local filesystem.
	- A text file content.
	"""
        ),
    ]

    def extract(self):
        # Retrieve the file path
        file_path = self.retrieve().as_posix()

        # Debugging: Print the file path to verify it is correct
        print(f"Attempting to open DOCX file at: {file_path}")

        # Check if the file exists
        if not Path(file_path).exists():
            raise FileNotFoundError(f"The file at {file_path} does not exist.")

        # Open the DOCX file
        doc = Document(file_path)

        for paragraph in doc.paragraphs:
            if paragraph.text:
                yield paragraph.text
            for run in paragraph.runs:
                if run.text:
                    continue
                else:
                    for inline in run.element.iter():  # type: ignore
                        if inline.tag.endswith("inline"):  # type: ignore
                            for pic in inline.iter():  # type:
                                if pic.tag.endswith("blip"):  # type: ignore
                                    image = pic.embed  # type: ignore
                                    image_part = run.part.related_parts[image]
                                    yield f"<img style='width: 24em;' src='data:image/png;base64,{base64.b64encode(image_part.blob).decode()}' />"
                                else:
                                    continue
                        else:
                            continue
                    continue

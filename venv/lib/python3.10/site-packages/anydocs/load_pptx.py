import typing as tp
from dataclasses import dataclass
import base64
import httpx
from pptx import Presentation
import typing_extensions as tpe
import tempfile

from ._base import Artifact


@dataclass
class PptxLoader(Artifact):
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

    def extract(self) -> tp.Generator[str, None, None]:
        # Check if the ref is a URL
        if self.ref.startswith("http"):
            # Download the file
            response = httpx.get(self.ref)
            response.raise_for_status()  # Check if the request was successful

            # Save the file to a temporary location
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pptx") as tmp_file:
                tmp_file.write(response.content)
                tmp_file_path = tmp_file.name

            # Load the presentation from the temporary file
            prs = Presentation(tmp_file_path)
        else:
            # Assume it's a local file path
            prs = Presentation(self.ref)

        # Extract text and images from the presentation
        for slide in prs.slides:
            for shape in slide.shapes:
                part = ""
                if shape.has_text_frame:
                    text_frame = shape.text_frame
                    for paragraph in text_frame.paragraphs:
                        for run in paragraph.runs:
                            if run.text:
                                part += run.text
                    yield f"<p>{part}</p>"
                if shape.shape_type == 13:  # Picture type
                    image = shape.image
                    yield f"<img style='width: 24em;' src='data:image/png;base64,{base64.b64encode(image.blob).decode()}' />"

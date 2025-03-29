from dataclasses import dataclass
from fitz import open as open_pdf  # type: ignore
import base64
from ._base import Artifact
import typing_extensions as tpe


@dataclass
class PdfLoader(Artifact):
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
        doc = open_pdf(self.retrieve())
        for page in doc:  # type: ignore
            for img in page.get_images():  # type: ignore
                xref = img[0]  # type: ignore
                base_image = doc.extract_image(xref)  # type: ignore
                image_bytes = base_image["image"]  # type: ignore
                assert isinstance(image_bytes, bytes)
                yield f"<img style='width: 24em;' src='data:image/png;base64,{base64.b64encode(image_bytes).decode()}' />"
            yield page.get_textpage().extractHTML()  # type: ignore

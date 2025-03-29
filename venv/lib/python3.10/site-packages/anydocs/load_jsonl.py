from dataclasses import dataclass

from ._base import Artifact
import typing_extensions as tpe


@dataclass
class JsonLoader(Artifact):
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
        with open(self.ref) as f:
            for line in f.readlines():
                yield line

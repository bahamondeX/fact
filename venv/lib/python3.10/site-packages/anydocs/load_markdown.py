import re
from dataclasses import dataclass

import base64c as base64  # type: ignore
import markdown
import typing_extensions as tpe

from ._base import Artifact


@dataclass
class MarkdownLoader(Artifact):
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
        pattern = r"!\[.*?\]\((.*?)\)"
        content = self.retrieve().read_text()
        for match in re.findall(pattern, content):
            if match.group:
                img_url = match.group(1)
                alt = match.group(2)
                yield f"<img style='width: 24em;' src='{img_url}' alt='{alt}' />"
            else:
                yield markdown.markdown(content)

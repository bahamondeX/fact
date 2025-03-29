import json
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
from decimal import Decimal

import base64c as base64  # type: ignore
from openpyxl import load_workbook
import typing_extensions as tpe

from ._base import Artifact


class JsonEncoder(json.JSONEncoder):
    def default(self, o: object) -> object:
        if isinstance(o, datetime):
            return o.isoformat()
        if isinstance(o, date):
            return o.isoformat()
        if isinstance(o, time):
            return o.isoformat()
        if isinstance(o, timedelta):
            return o.total_seconds()
        if isinstance(o, Decimal):
            return str(o)
        return super().default(o)


@dataclass
class ExcelLoader(Artifact):
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
        wb = load_workbook(filename=self.ref, data_only=True)
        for sheet_name in wb.sheetnames:
            sheet = wb[sheet_name]
            for row in sheet.iter_rows():
                for cell in row:
                    if cell.value:
                        data_dict = {
                            "sheet": sheet_name,
                            "pos": f"{cell.column}{cell.row}",
                            "value": cell.value,
                        }
                        yield json.dumps(data_dict, cls=JsonEncoder)

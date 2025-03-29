from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import Field

from anytools import MistralAgent
from anytools.search import WebSearchTool
from anytools import RagTool


class SearchAgent(MistralAgent):
    use_search: bool = Field(default=False)
    namespace: str = Field(default="default")

    async def run(self):
        if self.use_search:
            last_message = self.messages[-1].get("content")
            assert isinstance(last_message, str)
            rag_result = ""
            async for chunk in RagTool(content=last_message,namespace=self.namespace, topK=5, action="query").run():
                rag_result += chunk
            self.messages.append(
                {"role": "system", "content": f"`RAGTool` Results:\n" + rag_result}
            )
            search_result = ""
            async for chunk in WebSearchTool(query=last_message).run():
                search_result += chunk
            self.messages.append(
                {"role": "system", "content": f"`WebSearchTool` Results:\n" + search_result}
            )
        string = ""
        async for chunk in super().run():
            string += chunk
            yield chunk
        async for chunk in RagTool(content=string, namespace=self.namespace, action="upsert").run():
            continue


app = APIRouter(prefix="/v1")


@app.post("/chat")
async def research_handler(request: SearchAgent):
    return StreamingResponse(request.run())

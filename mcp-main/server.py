from mcp.server.fastmcp import FastMCP
from app import plan_project

mcp = FastMCP("project-planner-mcp")

@mcp.tool()
async def project_planner(project_name: str, end_date: str, total_tasks: int = 5) -> str:
    """
    MCP aracı: Projeyi verilen bitiş tarihine kadar günlere böler.
    - project_name: Projenin adı.
    - end_date: Bitiş tarihi (yyyy-mm-dd formatında).
    - total_tasks: Görev sayısı (varsayılan: 5).
    """
    return plan_project(project_name, end_date, total_tasks)

if __name__ == "__main__":
    mcp.run(transport="stdio")

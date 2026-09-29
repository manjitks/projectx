"""CLI entry point for ProjectX."""

from __future__ import annotations

import asyncio
from typing import Annotated

import typer
from rich.console import Console

from projectx.cli.repl import run_repl
from projectx.interfaces.text_generation import TextGenRequest

app = typer.Typer(
    name="projectx",
    help="ProjectX — Modular, provider-agnostic AI platform",
    no_args_is_help=False,
)
console = Console()


@app.callback(invoke_without_command=True)
def main(ctx: typer.Context) -> None:
    """ProjectX CLI root command."""
    if ctx.invoked_subcommand is None:
        run_repl()


@app.command()
def ask(
    prompt: Annotated[
        str, typer.Argument(help="The prompt to generate a response for")
    ],
    model: Annotated[
        str | None, typer.Option("--model", "-m", help="Model name")
    ] = None,
    provider: Annotated[
        str | None, typer.Option("--provider", "-p", help="Provider name")
    ] = None,
) -> None:
    """Generate a one-shot response from a prompt."""
    from projectx.core.bootstrap import get_application

    application = get_application()
    if not application.is_started:
        asyncio.run(application.startup())

    service = application.text_gen_service
    request = TextGenRequest(prompt=prompt, model=model)
    try:
        response = asyncio.run(service.generate(request, provider=provider))
        console.print(response.content)
    except Exception as exc:
        console.print(f"[bold red]Error:[/bold red] {exc}")
        raise typer.Exit(code=1) from exc
    finally:
        asyncio.run(application.shutdown())


if __name__ == "__main__":
    app()

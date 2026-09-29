"""Interactive REPL for ProjectX CLI."""

from __future__ import annotations

import asyncio

from rich.console import Console

from projectx.capabilities.text_gen.service import TextGenService
from projectx.interfaces.text_generation import TextGenRequest

console = Console()


def run_repl(service: TextGenService | None = None) -> None:
    """Run interactive REPL loop."""
    console.print("[bold cyan]Welcome to ProjectX REPL[/bold cyan]")
    console.print(
        "Type [green]/help[/green] for commands, [green]/quit[/green] to exit.\n"
    )

    from projectx.core.bootstrap import get_application

    started_by_repl = False
    application = None
    if service is not None:
        active_service = service
    else:
        application = get_application()
        if not application.is_started:
            asyncio.run(application.startup())
            started_by_repl = True
        active_service = application.text_gen_service

    try:
        while True:
            try:
                user_input = console.input("[bold blue]projectx>[/bold blue] ").strip()
            except (EOFError, KeyboardInterrupt):
                console.print("\nExiting ProjectX...")
                break

            if not user_input:
                continue

            if user_input in ("/quit", "/exit"):
                console.print("Goodbye!")
                break
            elif user_input == "/help":
                console.print("[bold]Available commands:[/bold]")
                console.print("  /help    Show this help message")
                console.print("  /models  List available models")
                console.print("  /quit    Exit the REPL")
            elif user_input == "/models":
                adapters = active_service.registry.list_adapters()
                if not adapters:
                    console.print("[yellow]No adapters currently registered.[/yellow]")
                else:
                    for manifest in adapters:
                        console.print(f"- {manifest.name}: {manifest.capabilities}")
            else:
                try:
                    request = TextGenRequest(prompt=user_input)
                    response = asyncio.run(active_service.generate(request))
                    console.print(f"[bold green]AI:[/bold green] {response.content}")
                except Exception as exc:
                    console.print(f"[bold red]Error:[/bold red] {exc}")
    finally:
        if started_by_repl and application is not None:
            asyncio.run(application.shutdown())

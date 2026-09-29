from typer.testing import CliRunner

from projectx.cli.main import app

runner = CliRunner()


class TestCLI:
    def test_help_flag(self):
        result = runner.invoke(app, ["--help"])
        assert result.exit_code == 0
        assert "ProjectX" in result.stdout

    def test_ask_help(self):
        result = runner.invoke(app, ["ask", "--help"])
        assert result.exit_code == 0

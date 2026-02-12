from os import mkdir
from os.path import exists
from shutil import move, rmtree
from subprocess import run
from sys import argv, exit
from time import sleep

argv.pop(0)


def get_file(filename: str):
    with open(filename, "r") as f:
        return f.read()


def create_file(filename: str, content: str = ""):
    with open(filename, "w") as f:
        f.write(content)


def execute(command: list[str], project_path: str = "."):
    run(command, cwd=project_path, check=True)


message = "PushAuto"

if "-m" in argv:
    message = argv[argv.index("-m") + 1]

if "-f" in argv:
    files = argv[argv.index("-f") + 1 :][0]
else:
    files = "."

execute(["git", "pull", "origin", "master"])
execute(["git", "add", files])
execute(["git", "commit", "-m", message])
execute(["git", "push", "-u", "origin", "master"])

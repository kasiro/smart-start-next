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


def execute(command: list[str], project_path: str = "./out"):
    run(command, cwd=project_path, check=True)


build_path = "./out"
kasiro_start_page_path = "./out/kasiro_start_page"
git_path = "./out/.git"

if exists(build_path):
    rmtree(build_path)
    print("build folder deleted...")
    # rebuild
    next_config = get_file("./next.config.mjs")
    if "// output" in next_config:
        next_config = next_config.replace('// output: "export",', 'output: "export",')
        create_file("./next.config.mjs", next_config)
    execute(["npm", "run", "build:css"], project_path=".")

    if "-k" in argv:
        if not exists(kasiro_start_page_path):
            mkdir(kasiro_start_page_path)
            move("./out/_next", kasiro_start_page_path)
            move("./out/favicon.ico", f"{kasiro_start_page_path}/favicon.ico")
            index_ = get_file("./out/index.html")
            index_ = index_.replace("/_next", "/kasiro_start_page/_next")
            create_file("./out/index.html", index_)
            print("path replaced kasiro_start_page/_next")
            print("generated kasiro_start_page/_next")

    # if "-n" in argv:
    if not exists("./out/.nojekyll"):
        create_file("./out/.nojekyll", "false")
    # elif exists("./out/.nojekyll"):
    #     remove("./out/.nojekyll")

    if "-d" in argv:
        if exists(git_path):
            rmtree(git_path)
            sleep(2)
            if exists(git_path):
                exit(".git репозиторий не удалён")
        if "-m" in argv and "-d" in argv:
            message = "postbuild: " + argv[argv.index("-m") + 1]
        else:
            message = '"postbuild auto deploy"'
        execute(["git", "init"])
        execute(
            [
                "git",
                "remote",
                "add",
                "origin",
                "git@github.com:kasiro/kasiro_start_page.git",
            ]
        )
        execute(["git", "branch", "-M", "test"])
        execute(["git", "add", "."])
        execute(["git", "commit", "-m", message])
        execute(["git", "push", "-f", "-u", "origin", "test"])
    elif exists(git_path):
        rmtree(git_path)

    next_config = get_file("./next.config.mjs")
    if 'output: "export",' in next_config and "//" not in next_config:
        next_config = next_config.replace('output: "export",', '// output: "export",')
        create_file("./next.config.mjs", next_config)
else:
    print("project is not build")
    print("out folder not found...")

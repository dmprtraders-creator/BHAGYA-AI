import os


def scan_project():

    files = []

    for root, dirs, filenames in os.walk("."):

        for file in filenames:

            files.append(
                os.path.join(
                    root,
                    file
                )
            )

    return files
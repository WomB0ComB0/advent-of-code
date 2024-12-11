from setuptools import setup, find_packages
import os

setup(
    name="advent-of-code",
    version="0.1.0",
    description="Advent of Code solutions and utilities",
    author="Mike Odnis",
    author_email="mike@mikeodnis.dev",
    url="https://github.com/WomB0ComB0/advent-of-code",
    packages=find_packages(where="utils/python", include=["test/python"]),
    install_requires=[
        "big_o",
    ],
    python_requires=">=3.13",
    project_urls={
        "Homepage": "https://github.com/WomB0ComB0/advent-of-code",
        "Source": "https://github.com/WomB0ComB0/advent-of-code",
        "Issue Tracker": "https://github.com/WomB0ComB0/advent-of-code/issues",
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Intended Audience :: Developers",
        "Operating System :: OS Independent",
    ],
    long_description=(
        open("README.md", encoding="utf-8").read()
        if os.path.exists("README.md")
        else ""
    ),
    long_description_content_type="text/markdown",
)

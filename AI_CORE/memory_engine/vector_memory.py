import json
import os

VECTOR_MEMORY_FILE = "vector_memory.json"


def load_memory():

    if os.path.exists(
        VECTOR_MEMORY_FILE
    ):

        with open(
            VECTOR_MEMORY_FILE,
            "r",
            encoding="utf-8"
        ) as f:

            return json.load(f)

    return []


def save_memory(memories):

    with open(
        VECTOR_MEMORY_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            memories,
            f,
            indent=4,
            ensure_ascii=False
        )


def add_memory(text):

    memories = load_memory()

    memories.append(text)

    save_memory(memories)


def search_memory(query):

    memories = load_memory()

    results = []

    query_words = query.lower().split()

    for memory in memories:

        score = 0

        for word in query_words:

            if word in memory.lower():

                score += 1

        if score > 0:

            results.append(memory)

    return results[-5:]
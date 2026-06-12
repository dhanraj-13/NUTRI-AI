class InteractionMemory:
    def __init__(self):
        self.history: dict[int, list[str]] = {}

    def add(self, user_id: int, text: str) -> None:
        self.history.setdefault(user_id, []).append(text)

    def get(self, user_id: int) -> list[str]:
        return self.history.get(user_id, [])


memory = InteractionMemory()

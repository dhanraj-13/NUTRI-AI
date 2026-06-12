from collections import defaultdict
from typing import Callable


class EventBus:
    def __init__(self):
        self.listeners = defaultdict(list)

    def subscribe(self, event_name: str, callback: Callable):
        self.listeners[event_name].append(callback)

    def emit(self, event_name: str, payload: dict):
        for callback in self.listeners[event_name]:
            callback(payload)


event_bus = EventBus()

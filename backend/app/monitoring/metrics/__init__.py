# metrics module

from time import perf_counter


class MetricsRegistry:
    def __init__(self) -> None:
        self.counters: dict[str, int] = {}
        self.timings: dict[str, list[float]] = {}

    def increment(self, name: str) -> None:
        self.counters[name] = self.counters.get(name, 0) + 1

    def observe(self, name: str, value: float) -> None:
        self.timings.setdefault(name, []).append(value)


metrics = MetricsRegistry()


class Timer:
    def __init__(self, name: str):
        self.name = name
        self.start = perf_counter()

    def stop(self) -> float:
        elapsed = perf_counter() - self.start
        metrics.observe(self.name, elapsed)
        return elapsed

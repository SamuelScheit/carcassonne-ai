from enum import Enum


class Side(Enum):
    TOP = "top"
    RIGHT = "right"
    BOTTOM = "bottom"
    LEFT = "left"
    CENTER = "center"

    # special for farmers
    TOP_LEFT = "top_left"
    TOP_RIGHT = "top_right"
    BOTTOM_LEFT = "bottom_left"
    BOTTOM_RIGHT = "bottom_right"

    def to_json(self):
        return self.value

    def __str__(self):
        return self.value

    @staticmethod
    def from_number(num):
        if num == 0: return Side.TOP
        if num == 1: return Side.BOTTOM
        if num == 2: return Side.LEFT
        if num == 3: return Side.RIGHT
        if num == 4: return Side.CENTER

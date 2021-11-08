from carcassonne.objects.actions.action import Action
from carcassonne.objects.coordinate import Coordinate
from carcassonne.objects.tile import Tile


class TileAction(Action):
    def __init__(self, tile: Tile, coordinate: Coordinate, tile_rotations: int):
        self.tile = tile
        self.coordinate = coordinate
        self.tile_rotations = tile_rotations

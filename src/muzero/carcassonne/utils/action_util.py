from carcassonne.carcassonne_game_state import CarcassonneGameState, GamePhase
from carcassonne.objects.actions.action import Action
from carcassonne.objects.actions.pass_action import PassAction
from carcassonne.objects.actions.tile_action import TileAction
from carcassonne.objects.playing_position import PlayingPosition
from carcassonne.utils.possible_move_finder import PossibleMoveFinder
from carcassonne.utils.tile_position_finder import TilePositionFinder

board_size = 15
board_tiles = board_size * board_size
tile_types = 20
rotations = 4
meeple_positions = 6


class ActionUtil:
    @staticmethod
    def get_possible_actions(state: CarcassonneGameState):
        actions: [Action] = []
        if state.phase == GamePhase.TILES:
            possible_playing_positions: [
                PlayingPosition
            ] = TilePositionFinder.possible_playing_positions(
                game_state=state, tile_to_play=state.next_tile)
            if len(possible_playing_positions) == 0:
                actions.append(PassAction())
            else:
                playing_position: PlayingPosition
                for playing_position in possible_playing_positions:
                    action = TileAction(tile=state.next_tile.turn(
                        playing_position.turns),
                                        coordinate=playing_position.coordinate,
                                        tile_rotations=playing_position.turns)
                    actions.append(action)
        elif state.phase == GamePhase.MEEPLES:
            possible_meeple_actions = PossibleMoveFinder.possible_meeple_actions(
                game_state=state)
            actions.extend(possible_meeple_actions)
            actions.append(PassAction())
        return actions

    @staticmethod
    def get_possible_actions2(state: CarcassonneGameState):
        if state.phase == GamePhase.ROTATION:
            return [
                board_tiles + tile_types + 0, board_tiles + tile_types + 1,
                board_tiles + tile_types + 2, board_tiles + tile_types + 3
            ]
        if state.phase == GamePhase.MEEPLES:
            return [
                board_tiles + tile_types + rotations + 0,
                board_tiles + tile_types + rotations + 1,
                board_tiles + tile_types + rotations + 2,
                board_tiles + tile_types + rotations + 3,
                board_tiles + tile_types + rotations + 4,
                board_tiles + tile_types + rotations + 5,
            ]
        if (state.phase == GamePhase.TILES):
            actions: [Action] = []
            possible_playing_positions: [
                PlayingPosition
            ] = TilePositionFinder.possible_playing_positions(
                game_state=state, tile_to_play=state.next_tile)

            for playing_position in possible_playing_positions:
                action = TileAction(tile=state.next_tile.turn(
                    playing_position.turns),
                                    coordinate=playing_position.coordinate,
                                    tile_rotations=playing_position.turns)
                a = action.coordinate.row * board_size
                a = a + action.coordinate.column

                actions.append(a)

            print("possible legal actions", actions)
            return actions

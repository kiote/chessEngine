import sys

board_state = [
  int('11111111', 2),
  int('11111111', 2),
  int('00000000', 2),
  int('00000000', 2),
  int('00000000', 2),
  int('00000000', 2),
  int('11111111', 2),
  int('11111111', 2)
]

# read board state
for index, line in enumerate(sys.stdin):
  board_state[index] = int(line, 2)

# save board state to file


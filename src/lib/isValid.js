// helper function to check if a cell is valid on the Board
import { SIDES } from 'containers/App.js';

export default function isValid(row, col) {
  return row >= 0 && row < SIDES && col >= 0 && col < SIDES
}

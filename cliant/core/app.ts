import {BlockType} from "../../server/model/BlockType";
import {Tetris} from "./Tetris";
import {Render} from "./Render";
/**
 * Created by vista on 2016/07/07.
 */

let a = [];
a.push(BlockType.LBlock);
a.push(BlockType.Rectangle)
a.push(BlockType.ReverseZBlock);
a.push(BlockType.LBlock);
a.push(BlockType.Rectangle);
a.push(BlockType.ZBlock);
a.push(BlockType.Square);
a.push(BlockType.Square);
a.push(BlockType.LBlock);
a.push(BlockType.Rectangle);
a.push(BlockType.LBlock);
const tetris = new Tetris();

tetris.setBlockList(a);
tetris.newGame();
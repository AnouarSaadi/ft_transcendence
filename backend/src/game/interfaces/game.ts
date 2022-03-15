import { Socket } from 'socket.io';
import { Consts, GameStates, BroadcastObject } from '../game_consts';
import Paddle from './paddle';
import Ball from './ball';
import Player from './player';
import { Game } from '../entities/game.entity';

class GameObj {
  private _id: string;
  private _player1: Player;
  private _player2: Player;
  private _ball: Ball;
  private _remove: Function;
  private _spectators: Socket[] = [];
  private _interval: NodeJS.Timer;

  constructor(
    player1: Player,
    player2: Player,
    removeGame: Function /* , type mn b3d */,
  ) {
    this._player1 = player1;
    this._player2 = player2;
    this._ball = new Ball();
    this._remove = removeGame;
    this._interval = setInterval(
      () => this.playGame(),
      1000 / Consts.framePerSec,
    );
  }

  private dataToBeSent = () : BroadcastObject => {
    return ({
      ball: {
        x: this._ball.getX(),
        y: this._ball.getY(),
      },
      paddles: {
        leftPad: this._player1.getPaddle().getY(),
        rightPad: this._player2.getPaddle().getY(),
      },
      score: {
        score1: this._player1.getScore(),
        score2: this._player2.getScore(),
      },
      state: this.gameState(),
    })
  }

  public sendData = () => {
    const current = this.dataToBeSent();
    this._player1.getSocket().emit('game_state', {...current, isWinner: this._player1.isWinner()});
    this._player2.getSocket().emit('game_state', {...current, isWinner: this._player2.isWinner()});
  }

  //! public resetGame(): void {
  //   this._ball.resetBall();
  //   this._player1.reset();
  //   this._player2.reset();
  // }

  public getId(): string {
    return this._id;
  }

  public getGamePlayer(playerSocket: Socket): Player {
    return this._player1.getSocket() === playerSocket
      ? this._player1
      : this._player2;
  }

  public getInterval() {
    return this._interval;
  }
  // * add watchers

  public getPlayersSockets = (): Socket[] => {
    return [this._player1.getSocket(), this._player2.getSocket()];
  };

  public gameState = (): GameStates => {
    if (
      this._player1.getScore() === Consts.MAX_SCORE ||
      this._player2.getScore() === Consts.MAX_SCORE
    ) {
      return GameStates.OVER;
    } else return GameStates.ON;
  };

  public stopGame(): void {
    clearInterval(this._interval);
    this._player1.clearPlayer();
    this._player2.clearPlayer();
    this._remove(this);
  }

  public playGame(): void {
    this._ball.ballHorizontalBounce();
    if (this._ball.PaddleBallCollision(this._player1.getPaddle())) {
      let collidePoint =
        this._ball.getY() -
        (this._player1.getPaddle().getY() + Consts.PADDLE_H / 2);
      collidePoint = collidePoint / (Consts.PADDLE_H / 2);
      let angleRad = (Math.PI / 4) * collidePoint;
      let direction =
        this._ball.getX() + Consts.BALL_RADIUS < Consts.CANVAS_W / 2 ? 1 : -1;
      this._ball.setVelocityX(
        direction * this._ball.getSpeed() * Math.cos(angleRad),
      );
      this._ball.setVelocityY(this._ball.getSpeed() * Math.sin(angleRad));
      this._ball.setSpeed(this._ball.getSpeed() + 0.2);
      // * if this paddle height > 50, paddle.height--;
    }

    if (this._ball.PaddleBallCollision(this._player2.getPaddle())) {
      let collidePoint =
        this._ball.getY() -
        (this._player2.getPaddle().getY() + Consts.PADDLE_H / 2);
      collidePoint = collidePoint / (Consts.PADDLE_H / 2);
      let angleRad = (Math.PI / 4) * collidePoint;
      let direction =
        this._ball.getX() + Consts.BALL_RADIUS < Consts.CANVAS_W / 2 ? 1 : -1;
      this._ball.setVelocityX(
        direction * this._ball.getSpeed() * Math.cos(angleRad),
      );
      this._ball.setVelocityY(this._ball.getSpeed() * Math.sin(angleRad));
      this._ball.setSpeed(this._ball.getSpeed() + 0.2);
      // * if this paddle height > 50, paddle.height--;
    }

    if (this._ball.getX() - Consts.BALL_RADIUS <= 0) {
      this._player2.incScore();
      this._ball.resetBall();
    } else if (this._ball.getX() + Consts.BALL_RADIUS >= Consts.CANVAS_W) {
      this._player1.incScore();
      this._ball.resetBall();
    }
    this._ball.moveBall();

    this.sendData();
    if (this.gameState() === GameStates.OVER) {
      this.stopGame();
    }
  }

  public playerLeftGame = (client: Socket): void => {
    //TODO: change players status to online
    if (this._player1.getSocket() === client) {
      this._player1.setScore(0);
      this._player2.setScore(Consts.MAX_SCORE);
    } else if (this._player2.getSocket() === client) {
      this._player2.setScore(0);
      this._player1.setScore(Consts.MAX_SCORE);
    }
    this.sendData();
    this.stopGame();
  };

  // public removeSpectators() : void {
  //   if (this._spectators.length > 0)
  //     this._spectators.splice(0, this._spectators.length);
  // }
}

export default GameObj;

//* DONE: handle players disconnection
//* DONE: Refactor playGame
//TODO: arrow func
//TODO: set spectators
//TODO: check unused func
//TODO: deal with ball speed after finding someone to play with
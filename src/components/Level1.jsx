import { useEffect, useRef } from "react";
import Phaser from "phaser";

const Level1 = () => {
  const gameContainer = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1600,
        height: 800,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
          debug: true,
        },
      },
      scene: {
        preload,
        create,
        update,
      },
      parent: gameContainer.current,
    };

    const game = new Phaser.Game(config);

    function preload() {
      /******************** TERRENO *********************************/
      this.load.image("sky", "/assets/level1/terrain/sky.png");
      this.load.image("ground", "/assets/level1/terrain/platform.png");

      /******************** ITEMS *********************************/
      this.load.image("star", "/assets/level1/items/star.png");
      this.load.image("diamond", "/assets/level1/items/diamond.png");

      /******************** POWER-UPS *********************************/
      this.load.image("speedBoost", "/assets/level1/power-ups/velocidad.png");
      this.load.image("heart", "/assets/level1/power-ups/heart.png");
      this.load.image("lifeKit", "/assets/level1/power-ups/life.png");
      this.load.image("jumpBoots", "/assets/level1/power-ups/boots.png");

      /******************** SOUNDS *********************************/
      this.load.audio("hitSound", "/assets/level1/songs/Hit.ogg");
      this.load.audio("jumpSound", "/assets/level1/songs/Jump.ogg");
      this.load.audio("powerSound", "/assets/level1/songs/Power.ogg");

      /******************** PLAYER *********************************/

      this.load.spritesheet("dude", "/assets/level1/character/dude.png", {
        frameWidth: 32,
        frameHeight: 48,
      });

      /******************** ENEMIES *********************************/

      this.load.spritesheet("baddie", "/assets/level1/enemies/baddie.png", {
        frameWidth: 32,
        frameHeight: 32,
      });
      this.load.spritesheet("duck", "/assets/level1/enemies/duck.png", {
        frameWidth: 36,
        frameHeight: 36,
      });
    }

    let background;

    let platforms;
    let cursors;
    let stars;
    let diamonds;
    let speedBoosts;
    let score = 0;
    let scoreText;

    let hearts;
    let lives = 3;

    let player;

    let baddies;
    let ducks;

    let speedBoostActive = true;
    let jumpBoostActive = false;
    let isJumping = true;

    function create() {
      /**************************** BACKGROUND *****************************/

      background = this.add.tileSprite(0, 0, 8000, 1800, "sky");
      background.setOrigin(0, 0);
      background.setScale(0.5);

      this.cameras.main.setBounds(0, 0, 4000, 800);
      this.physics.world.setBounds(0, 0, 4000, 800);

      platforms = this.physics.add.staticGroup();

      const ground = platforms.create(0, this.scale.height - 32, "ground");
      ground.setScale(60, 2).refreshBody();

      platforms.create(500, 600, "ground").refreshBody();
      platforms.create(-150, 450, "ground").refreshBody();
      platforms.create(850, 350, "ground").refreshBody();
      platforms.create(100, 200, "ground").refreshBody();
      platforms.create(1500, 400, "ground").refreshBody();
      platforms.create(2500, 250, "ground").refreshBody();

      /**************************** PLAYER *****************************/

      player = this.physics.add.sprite(32, this.scale.height - 150, "dude");
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);

      this.cameras.main.startFollow(player);
      this.physics.add.collider(player, platforms);

      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });

      /**************************** POWER UPS *****************************/

      const jumpBoots = this.physics.add.group();
      jumpBoots.create(400, 500, "jumpBoots");
      jumpBoots.create(1600, 350, "jumpBoots");
      jumpBoots.create(2300, 200, "jumpBoots");

      this.physics.add.collider(jumpBoots, platforms);
      this.physics.add.overlap(player, jumpBoots, collectJumpBoots, null, this);

      const lifeKits = this.physics.add.group();
      lifeKits.create(300, 500, "lifeKit");
      lifeKits.create(1200, 350, "lifeKit");
      lifeKits.create(2000, 300, "lifeKit");
      lifeKits.create(2800, 150, "lifeKit");

      this.physics.add.collider(lifeKits, platforms);
      this.physics.add.overlap(player, lifeKits, collectLifeKit, null, this);

      speedBoosts = this.physics.add.group();
      speedBoosts.create(500, 300, "speedBoost");

      this.physics.add.collider(speedBoosts, platforms);
      this.physics.add.overlap(
        player,
        speedBoosts,
        collectSpeedBoost,
        null,
        this
      );

      hearts = this.add.group({
        key: "heart",
        repeat: 2,
        setXY: { x: 16, y: 16, stepX: 40 },
      });

      hearts.children.iterate(function (child) {
        child.setScrollFactor(0);
      });

      /**************************** ITEMS *****************************/

      diamonds = this.physics.add.group();
      diamonds.create(200, 400, "diamond");
      diamonds.create(600, 300, "diamond");
      diamonds.create(1000, 500, "diamond");

      diamonds.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      this.physics.add.collider(diamonds, platforms);
      this.physics.add.overlap(player, diamonds, collectDiamond, null, this);

      stars = this.physics.add.group();
      stars.create(100, 300, "star");
      stars.create(400, 500, "star");
      stars.create(700, 200, "star");

      stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.6, 0.8));
      });

      this.physics.add.collider(stars, platforms);
      this.physics.add.overlap(player, stars, collectStar, null, this);

      scoreText = this.add
        .text(16, 50, "Score: 0", {
          fontSize: "32px",
          fill: "#000",
        })
        .setScrollFactor(0);

      cursors = this.input.keyboard.createCursorKeys();

      /**************************** ENEMIES *****************************/

      baddies = this.physics.add.group();
      const baddiePositions = [
        { x: 600, y: 500 },
        { x: 800, y: 300 },
        { x: 1200, y: 400 },
        { x: 1600, y: 350 },
      ];

      baddiePositions.forEach((pos) => {
        const baddie = baddies.create(pos.x, pos.y, "baddie");
        baddie.setBounce(1);
        baddie.setCollideWorldBounds(true);
        baddie.setVelocity(Phaser.Math.Between(-100, 100), 20);
      });

      this.physics.add.collider(baddies, platforms);
      this.physics.add.collider(player, baddies, hitBaddie, null, this);

      this.anims.create({
        key: "duckWalk",
        frames: this.anims.generateFrameNumbers("duck", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });

      ducks = this.physics.add.group();
      const duck1 = ducks
        .create(600, 500, "duck")
        .setVelocityX(100)
        .anims.play("duckWalk", true);
      const duck2 = ducks
        .create(1200, 400, "duck")
        .setVelocityX(100)
        .anims.play("duckWalk", true);
      const duck3 = ducks
        .create(1800, 350, "duck")
        .setVelocityX(100)
        .anims.play("duckWalk", true);

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changeDuckDirection(duck1),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changeDuckDirection(duck2),
        loop: true,
      });

      this.time.addEvent({
        delay: Phaser.Math.Between(2000, 4000),
        callback: () => changeDuckDirection(duck3),
        loop: true,
      });

      this.physics.add.collider(ducks, platforms);
      this.physics.add.collider(player, ducks, hitDuck, null, this);
    }

    function update() {
      background.tilePositionX = this.cameras.main.scrollX;

      if (cursors.left.isDown) {
        player.setVelocityX(speedBoostActive ? -600 : -150);
        player.anims.play("left", true);
      } else if (cursors.right.isDown) {
        player.setVelocityX(speedBoostActive ? 600 : 150);
        player.anims.play("right", true);
      } else {
        player.setVelocityX(0);
        player.anims.stop();
        player.setFrame(4);
      }

      if (cursors.up.isDown && player.body.touching.down && !isJumping) {
        player.setVelocityY(jumpBoostActive ? -600 : -350);
        this.sound.play("jumpSound");
        isJumping = true;
      }

      if (player.body.touching.down) {
        isJumping = false;
      }

      ducks.children.iterate(function (duck) {
        if (duck.body.blocked.right) {
          duck.setVelocityX(-100);
          duck.flipX = true;
        } else if (duck.body.blocked.left) {
          duck.setVelocityX(100);
          duck.flipX = false;
        }
      });
    }

    function collectStar(player, star) {
      star.disableBody(true, true);
      score += 10;
      scoreText.setText("Score: " + score);
    }

    function collectDiamond(player, diamond) {
      diamond.disableBody(true, true);
      score += 50;
      scoreText.setText("Score: " + score);
    }

    function collectSpeedBoost(player, speedBoost) {
      speedBoost.disableBody(true, true);
      speedBoostActive = true;

      this.sound.play("powerSound");

      this.time.delayedCall(
        10000,
        () => {
          speedBoostActive = false;
        },
        [],
        this
      );
    }

    function collectJumpBoots(player, boots) {
      boots.disableBody(true, true);

      jumpBoostActive = true;

      this.time.delayedCall(
        10000,
        () => {
          jumpBoostActive = false;
        },
        [],
        this
      );
    }

    function collectLifeKit(player, lifeKit) {
      lifeKit.disableBody(true, true);

      if (lives < 3) {
        lives++;
        hearts.getChildren()[lives - 1].setVisible(true);
      }
    }

    function hitBaddie(player, baddie) {
      if (
        (player.body.velocity.y > 0 &&
          baddie.body.touching.up &&
          !baddie.body.touching.down) ||
        (player.body.touching.down && baddie.body.touching.up)
      ) {
        baddie.disableBody(true, true);
        score += 100;
        scoreText.setText("Score: " + score);
        player.setVelocityY(-50);

        this.sound.play("hitSound");
      } else {
        loseLife();
        player.setTint(0xff0000);

        this.time.delayedCall(
          500,
          () => {
            player.clearTint();
          },
          [],
          this
        );
      }
    }

    function hitDuck(player, duck) {
      if (
        (player.body.velocity.y > 0 &&
          duck.body.touching.up &&
          !duck.body.touching.down) ||
        (player.body.touching.down && duck.body.touching.up)
      ) {
        duck.disableBody(true, true);
        score += 100;
        scoreText.setText("Score: " + score);
        player.setVelocityY(-200);
        this.sound.play("hitSound");
      } else {
        loseLife();
        player.setTint(0xff0000);
        this.time.delayedCall(
          500,
          () => {
            player.clearTint();
          },
          [],
          this
        );
      }
    }

    function changeDuckDirection(duck) {
      const newDirection = Phaser.Math.Between(0, 1) === 0 ? -100 : 100;
      duck.setVelocityX(newDirection);
      duck.flipX = newDirection > 0;
    }

    function loseLife() {
      lives--;
      if (lives >= 0) {
        hearts.getChildren()[lives].setVisible(false);
      }

      if (lives === 0) {
        gameOver();
      }
    }

    function gameOver() {
      this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play("turn");
    }

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={gameContainer}
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    ></div>
  );
};

export default Level1;

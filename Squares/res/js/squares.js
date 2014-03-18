$(document).ready(function() {
    // initialise canvas
    var dims = [window.innerWidth - 30, window.innerHeight - 30];
    $("canvas").attr("width", dims[0]).attr("height", dims[1]);
    var dirs = {
        left: 0,
        up: 1,
        right: 2,
        down: 3
    };
    // player
    var player = new (function Player() {
        this.x = dims[0] / 2;
        this.y = dims[1] / 2;
        this.speed = 500;
    });
    var score = 0;
    // bullets
    var bullets = [];
    var Bullet = function Bullet(x, y, dir) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.speed = 750;
        this.done = false;
    };
    Bullet.prototype.move = function move(len) {
        switch (this.dir) {
            case dirs.up:
                this.y -= this.speed * len;
                if (this.y < -10) {
                    this.done = true;
                }
                break;
            case dirs.down:
                this.y += this.speed * len;
                if (this.y > dims[1] + 10) {
                    this.done = true;
                }
                break;
            case dirs.left:
                this.x -= this.speed * len;
                if (this.x < -10) {
                    this.done = true;
                }
                break;
            case dirs.right:
                this.x += this.speed * len;
                if (this.x > dims[0] + 10) {
                    this.done = true;
                }
                break;
        }
    };
    // blocks
    var blocks = [];
    var Block = function Block(x, y, dir) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.size = 50 + (Math.random() * 50)
        this.speed = 100 + (Math.random() * 200);
        this.angle = 0;
        this.rotate = -2 + (Math.random() * 4);
        this.done = false;
    };
    Block.prototype.move = function move(len) {
        switch (this.dir) {
            case dirs.up:
                this.y -= this.speed * len;
                if (this.y < -30) {
                    this.done = true;
                }
                break;
            case dirs.down:
                this.y += this.speed * len;
                if (this.y > dims[1] + 30) {
                    this.done = true;
                }
                break;
            case dirs.left:
                this.x -= this.speed * len;
                if (this.x < -30) {
                    this.done = true;
                }
                break;
            case dirs.right:
                this.x += this.speed * len;
                if (this.x > dims[0] + 30) {
                    this.done = true;
                }
                break;
        }
    };
    // update entities on each clock tick
    var activeKeys = {};
    $(window).keydown(function(e) {
        activeKeys[e.keyCode] = true;
    }).keyup(function(e) {
        delete activeKeys[e.keyCode];
    });
    var keyCodes = {
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        a: 65,
        d: 68,
        s: 83,
        w: 87
    };
    var keyCool = 0;
    var fps = [];
    var update = function update(len) {
        fps.push(1 / len);
        if (fps.length > 10) {
            fps.splice(0, fps.length - 10);
        }
        // player
        if (keyCodes.w in activeKeys) {
            player.y -= player.speed * len;
            if (player.y < 14) {
                player.y = 14;
            }
        }
        if (keyCodes.s in activeKeys) {
            player.y += player.speed * len;
            if (player.y > dims[1] - 14) {
                player.y = dims[1] - 14;
            }
        }
        if (keyCodes.a in activeKeys) {
            player.x -= player.speed * len;
            if (player.x < 14) {
                player.x = 14;
            }
        }
        if (keyCodes.d in activeKeys) {
            player.x += player.speed * len;
            if (player.x > dims[0] - 14) {
                player.x = dims[0] - 14;
            }
        }
        // bullets
        for (var i = bullets.length - 1; i >= 0; i--) {
            bullets[i].move(len);
            if (bullets[i].done) {
                bullets.splice(i, 1);
            }
        }
        if (keyCool) {
            keyCool--;
        }
        if (keyCodes.left in activeKeys) {
            if (!keyCool) {
                bullets.push(new Bullet(player.x, player.y, dirs.left));
                keyCool = 10;
            }
        }
        if (keyCodes.up in activeKeys) {
            if (!keyCool) {
                bullets.push(new Bullet(player.x, player.y, dirs.up));
                keyCool = 10;
            }
        }
        if (keyCodes.down in activeKeys) {
            if (!keyCool) {
                bullets.push(new Bullet(player.x, player.y, dirs.down));
                keyCool = 10;
            }
        }
        if (keyCodes.right in activeKeys) {
            if (!keyCool) {
                bullets.push(new Bullet(player.x, player.y, dirs.right));
                keyCool = 10;
            }
        }
        // blocks
        for (var i = blocks.length - 1; i >= 0; i--) {
            blocks[i].move(len);
            for (var j in bullets) {
                if (Math.abs(blocks[i].x - bullets[j].x) < blocks[i].size / 2 && Math.abs(blocks[i].y - bullets[j].y) < blocks[i].size / 2) {
                    blocks[i].done = true;
                    bullets[j].done = true;
                    bullets.splice(i, 1);
                    score++;
                    break;
                }
            }
            if (blocks[i].done) {
                blocks.splice(i, 1);
            }
        }
    };
    // redraw entities
    $("canvas").drawArc({
        layer: true,
        name: "player",
        groups: ["foreground"],
        strokeStyle: "white",
        strokeWidth: 2,
        fillStyle: "black",
        x: player.x,
        y: player.y,
        radius: 12
    })
    .drawRect({
        layer: true,
        groups: ["foreground"],
        strokeStyle: "white",
        strokeWidth: 1,
        fillStyle: "#222",
        x: dims[0] - 50,
        y: 20,
        width: 101,
        height: 41
    })
    .drawText({
        layer: true,
        name: "score",
        groups: ["foreground"],
        fillStyle: "white",
        x: dims[0] - 50,
        y: 19,
        fontSize: "12pt"
    })
    .drawRect({
        layer: true,
        groups: ["foreground"],
        strokeStyle: "white",
        strokeWidth: 1,
        fillStyle: "#222",
        x: 40,
        y: dims[1] - 20,
        width: 81,
        height: 41
    })
    .drawText({
        layer: true,
        name: "fps",
        groups: ["foreground"],
        fillStyle: "white",
        x: 40,
        y: dims[1] - 21,
        fontSize: "10pt"
    });
    var foreground = $("canvas").getLayerGroup("foreground");
    var redraw = function() {
        $("canvas").setLayer("player", {
            x: player.x,
            y: player.y
        })
        .setLayer("score", {
            text: "Score: " + score
        });
        var avgFps = 0;
        for (var i in fps) {
            avgFps += fps[i];
        }
        $("canvas").setLayer("fps", {
            text: "FPS: " + Math.floor(avgFps / fps.length)
        })
        .removeLayerGroup("bullets")
        .removeLayerGroup("blocks");
        for (var i in bullets) {
            $("canvas").drawArc({
                layer: true,
                groups: ["bullets"],
                strokeStyle: "white",
                strokeWidth: 2,
                fillStyle: "black",
                x: bullets[i].x,
                y: bullets[i].y,
                radius: 8
            });
        }
        for (var i in blocks) {
            $("canvas").drawRect({
                layer: true,
                groups: ["blocks"],
                strokeStyle: "white",
                strokeWidth: 2,
                fillStyle: "black",
                x: blocks[i].x,
                y: blocks[i].y,
                width: blocks[i].size,
                height: blocks[i].size,
                rotate: blocks[i].angle
            });
            blocks[i].angle += blocks[i].rotate;
        }
        for (var i in foreground) {
            $("canvas").moveLayer(foreground[i], -1);
        }
        $("canvas").drawLayers();
    };
    // main loop
    var main = function main() {
        var now = new Date;
        var delta = now - then;
        update(delta / 1000);
        redraw();
        then = now;
    };
    var then = Date.now();
    setInterval(main, 1);
    // block loop
    var spawnBlock = function spawnBlock() {
        var opt = Math.random();
        var prop = Math.random();
        if (opt < 0.25) {
            blocks.push(new Block(-28, Math.floor(Math.round(prop * dims[1])), dirs.right));
        } else if (opt < 0.5) {
            blocks.push(new Block(dims[0] + 28, Math.floor(Math.round(prop * dims[1])), dirs.left));
        } else if (opt < 0.75) {
            blocks.push(new Block(Math.floor(Math.round(prop * dims[0])), -28, dirs.down));
        } else {
            blocks.push(new Block(Math.floor(Math.round(prop * dims[0])), dims[1] + 28, dirs.up));
        }
        setTimeout(spawnBlock, Math.random() * 1000);
    }
    spawnBlock();
});

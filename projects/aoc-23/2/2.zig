const std = @import("std");

const Required = enum(u32) { red = 12, green = 13, blue = 14 };

const GameParseState = enum {
    count,
    color,
};

const GameData = struct {
    id: u32 = 0,
    max_red: u32 = 0,
    max_green: u32 = 0,
    max_blue: u32 = 0,
};

pub inline fn char_to_int(c: u8) u8 {
    return c - '0';
}

pub fn max(a: u32, b: u32) u32 {
    return if (a > b) a else b;
}

pub fn line_value(line: []u8) u32 {

    // Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue

    var game = GameData{};

    var ind: usize = 5;
    while (ind < line.len and line[ind] != ':') : (ind += 1) {
        game.id = game.id * 10 + char_to_int(line[ind]);
    }
    ind += 2;

    var state = GameParseState.count;
    var value: u32 = 0;

    while (ind < line.len) : (ind += 1) {
        const char: u8 = line[ind];
        switch (state) {
            .count => {
                if (char == ' ') {
                    state = .color;
                    continue;
                }
                value = value * 10 + char_to_int(char);
                state = .count;
            },
            .color => {
                switch (char) {
                    'b' => {
                        game.max_blue = max(game.max_blue, value);
                        ind += 5;
                    },
                    'r' => {
                        game.max_red = max(game.max_red, value);
                        ind += 4;
                    },
                    'g' => {
                        game.max_green = max(game.max_green, value);
                        ind += 6;
                    },
                    else => {
                        std.debug.print("WHAT THE HELL THIS IS IMPOSSIBLE\n", .{});
                    },
                }
                value = 0;
                state = .count;
            },
        }
    }

    // std.debug.print("Game: {}\n", .{game});

    // PART 1
    // if (game.max_red <= @intFromEnum(Required.red) and
    //     game.max_blue <= @intFromEnum(Required.blue) and
    //     game.max_green <= @intFromEnum(Required.green))
    // {
    //     return game.id;
    // }
    // return 0;

    // PART 2
    return game.max_red * game.max_blue * game.max_green;
}

pub fn main() !void {
    const file = try std.fs.cwd().openFile("2.in", .{ .mode = .read_only });
    defer file.close();

    var buf_reader = std.io.bufferedReader(file.reader());
    var in_stream = buf_reader.reader();
    var buffer: [1024]u8 = undefined;
    var sum: u32 = 0;
    while (try in_stream.readUntilDelimiterOrEof(&buffer, '\n')) |line| {
        const line_val = line_value(line);
        // std.debug.print("Line val: {}\n", .{line_val});
        sum += line_val;
    }

    std.debug.print("{d}\n", .{sum});
}

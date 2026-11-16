const std = @import("std");

const Race = struct {
    time: u64,
    dist: i64,
};

const Part1_Examples = [_]Race{
    .{ .time = 7, .dist = 9 },
    .{ .time = 15, .dist = 40 },
    .{ .time = 30, .dist = 200 },
};

const Part1 = [_]Race{
    .{ .time = 41, .dist = 214 },
    .{ .time = 96, .dist = 1789 },
    .{ .time = 88, .dist = 1127 },
    .{ .time = 94, .dist = 1055 },
};

const Part2_Examples = [_]Race{
    .{ .time = 71530, .dist = 940200 },
};
const Part2 = [_]Race{
    .{ .time = 41968894, .dist = 214178911271055 },
};

pub fn solve_race_product(races: []const Race) u128 {
    var product: u128 = 1;
    for (races) |race| {
        var race_counter: u128 = 0;
        for (0..race.time + 1) |hold_for| {
            const time_left = race.time - hold_for;
            if (time_left * hold_for > race.dist) {
                race_counter += 1;
            }
        }
        product *= race_counter;
    }
    return product;
}

pub fn main() void {
    std.debug.print("Part 1: {d}\n", .{solve_race_product(&Part1)});
    std.debug.print("Part 2: {d}\n", .{solve_race_product(&Part2)});
}

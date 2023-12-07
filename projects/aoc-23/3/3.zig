const std = @import("std");

pub fn main() !void {
    const file = try std.fs.cwd().openFile("3.in", .{ .mode = .read_only });
    defer file.close();

    var buf_reader = std.io.bufferedReader(file.reader());
    var in_stream = buf_reader.reader();
    var prev_line: [1024]u8 = [_]u8{0} ** 1024;
    var curr_line: [1024]u8 = [_]u8{0} ** 1024;
    var next_line: [1024]u8 = [_]u8{0} ** 1024;

    var line_len: usize = 0;
    const first_line = try in_stream.readUntilDelimiterOrEof(&prev_line, '\n');
    line_len = first_line.?.len;
    _ = try in_stream.readUntilDelimiterOrEof(&curr_line, '\n');

    var part_sum: u64 = 0;
    var gear_sum: u64 = 0;

    // check first line
    part_sum += line_parts_sum(prev_line.len, next_line, prev_line, curr_line);
    gear_sum += line_gear_sum(prev_line.len, next_line, prev_line, curr_line);
    // check middle lines
    while (try in_stream.readUntilDelimiterOrEof(&next_line, '\n')) |line| {
        part_sum += line_parts_sum(line.len, prev_line, curr_line, next_line);
        gear_sum += line_gear_sum(line.len, prev_line, curr_line, next_line);
        prev_line = curr_line;
        curr_line = next_line;
    }
    // check the last line
    part_sum += line_parts_sum(next_line.len, prev_line, curr_line, next_line);
    gear_sum += line_gear_sum(next_line.len, prev_line, curr_line, next_line);

    std.debug.print("Parts Sum: {d}\n", .{part_sum});
    std.debug.print("Gear Sum: {d}\n", .{gear_sum});
}

const InclusiveRange = struct {
    start: usize,
    end: usize,
};

const Dir = enum(usize) { NW = 0, N, NE, W, E, SW, S, SE, LENGTH };
const NeighborType = enum {
    part,
    symbol,
    nothing,
};
const PartNumber = u64;
const Symbol = u8;
const NeighborValue = union {
    part: PartNumber,
    symbol: Symbol,
};
const Neighbor = struct {
    value: NeighborValue,
    indices: InclusiveRange,
    type: NeighborType = .nothing,
};

pub fn is_symbol(c: u8) bool {
    return switch (c) {
        '!', '@', '#', '$', '%', '^', '&', '*', '-', '+', '=', '/' => true,
        else => false,
    };
}

pub fn is_digit(c: u8) bool {
    return c >= '0' and c <= '9';
}

pub inline fn max(a: usize, b: usize) usize {
    return if (a > b) a else b;
}
pub inline fn min(a: usize, b: usize) usize {
    return if (a < b) a else b;
}

pub fn has_symbol_neighbor(range: InclusiveRange, length: usize, prev: [1024]u8, curr: [1024]u8, next: [1024]u8) bool {
    if ((range.start > 0 and is_symbol(curr[range.start - 1])) or
        (range.end < length and is_symbol(curr[range.end + 1])))
    {
        return true;
    }

    for ((range.start -| 1)..min(range.end + 2, length)) |col| {
        if (is_symbol(prev[col]) or
            is_symbol(next[col]))
        {
            return true;
        }
    }
    return false;
}

pub fn line_parts_sum(length: usize, prev: [1024]u8, curr: [1024]u8, next: [1024]u8) u64 {
    var sum: u64 = 0;
    var ind: usize = 0;

    while (ind < curr.len) : (ind += 1) {
        var char = curr[ind];
        if (is_digit(char)) {
            var inds: InclusiveRange = .{ .start = ind, .end = ind };
            var p: PartNumber = 0;
            while (ind < curr.len and is_digit(curr[ind])) : (ind += 1) {
                char = curr[ind];
                p = p * 10 + char - '0';
            }
            ind -= 1;
            inds.end = ind;
            if (has_symbol_neighbor(inds, length, prev, curr, next)) {
                sum += p;
            }
        }
    }

    return sum;
}

pub fn line_gear_sum(length: usize, prev: [1024]u8, curr: [1024]u8, next: [1024]u8) u64 {
    var sum: u64 = 0;
    var ind: usize = 0;
    while (ind < length) : (ind += 1) {
        const char = curr[ind];
        if (char == '*') {
            // calculate the sum of neighbor parts
            var neighbor_part_count: u8 = 0;
            const neighbors = get_neighbors(ind, length, prev, curr, next);
            for (neighbors) |neighbor| {
                if (neighbor.type == .part) {
                    neighbor_part_count += 1;
                }
            }
            // std.debug.print("NC: {d}\n", .{neighbor_part_count});
            // std.debug.print("Neighbors:\n", .{});
            // var i: u8 = 1;
            // for (neighbors) |neighbor| {
            //     std.debug.print("  [{d}] {}\n", .{ i, neighbor });
            //     i += 1;
            // }

            if (neighbor_part_count == 2) {
                var gear_ratio: u64 = 1;
                for (neighbors) |neighbor| {
                    if (neighbor.type == .part) {
                        gear_ratio *= neighbor.value.part;
                    }
                }
                sum += gear_ratio;
            }
        }
    }

    return sum;
}

pub fn get_neighbors(start: usize, length: usize, prev: [1024]u8, curr: [1024]u8, next: [1024]u8) [8]Neighbor {
    var neighbors: [8]Neighbor = [_]Neighbor{.{
        .value = .{ .part = 0 },
        .indices = undefined,
    }} ** 8;

    // Check West
    if (start > 0) {
        neighbors[@intFromEnum(Dir.NW)] = find_neighbor(start - 1, prev[0..length], length);
        neighbors[@intFromEnum(Dir.W)] = find_neighbor(start - 1, curr[0..length], length);
        neighbors[@intFromEnum(Dir.SW)] = find_neighbor(start - 1, next[0..length], length);
    }

    // Check Center
    if (neighbors[@intFromEnum(Dir.NW)].indices.end < start) {
        neighbors[@intFromEnum(Dir.N)] = find_neighbor(start, prev[0..length], length);
    }
    if (neighbors[@intFromEnum(Dir.SW)].indices.end < start) {
        neighbors[@intFromEnum(Dir.S)] = find_neighbor(start, next[0..length], length);
    }

    // Check East
    if (start < length - 1) {
        if (neighbors[@intFromEnum(Dir.NW)].indices.end < start + 1 and
            neighbors[@intFromEnum(Dir.N)].indices.end < start + 1)
        {
            neighbors[@intFromEnum(Dir.NE)] = find_neighbor(start + 1, prev[0..length], length);
        }

        neighbors[@intFromEnum(Dir.E)] = find_neighbor(start + 1, curr[0..length], length);

        if (neighbors[@intFromEnum(Dir.SW)].indices.end < start + 1 and
            neighbors[@intFromEnum(Dir.S)].indices.end < start + 1)
        {
            neighbors[@intFromEnum(Dir.SE)] = find_neighbor(start + 1, next[0..length], length);
        }
    }

    return neighbors;
}

pub fn find_neighbor(start: usize, line: []const u8, length: usize) Neighbor {

    // Symbol
    if (is_symbol(line[start])) {
        return .{ .value = .{ .symbol = line[start] }, .type = .symbol, .indices = .{ .start = start, .end = start } };
    }

    // Nothing
    if (!is_digit(line[start])) {
        return .{ .value = undefined, .indices = .{ .start = start, .end = start } };
    }

    // PartNumber

    // 1: find start
    var ind = start;
    while (ind > 0 and is_digit(line[ind])) : (ind -= 1) {}
    if (!is_digit(line[ind])) {
        ind += 1;
    }
    var neighbor: Neighbor = .{ .type = .part, .value = .{ .part = 0 }, .indices = .{ .start = ind, .end = start } };
    neighbor.indices.start = ind;

    // 2: Accumulate til end
    while (ind < length and is_digit(line[ind])) : (ind += 1) {
        neighbor.value.part = neighbor.value.part * 10 + line[ind] - '0';
    }
    neighbor.indices.end = ind - 1;
    return neighbor;
}

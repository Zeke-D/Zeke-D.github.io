const std = @import("std");

pub fn main() !void {
    const filename = "5.in";
    // const filename = "5_ex.in";
    const file = try std.fs.cwd().openFile(filename, .{ .mode = .read_only });
    defer file.close();

    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    var buf_reader = std.io.bufferedReader(file.reader());
    var in_stream = buf_reader.reader();

    var conversions: [@intFromEnum(Conversions.length)]std.ArrayList(Map) = .{
        std.ArrayList(Map).init(allocator),
        std.ArrayList(Map).init(allocator),
        std.ArrayList(Map).init(allocator),
        std.ArrayList(Map).init(allocator),
        std.ArrayList(Map).init(allocator),
        std.ArrayList(Map).init(allocator),
        std.ArrayList(Map).init(allocator),
    };

    var buffer = [_]u8{0} ** 1024;
    var part_one_seeds = std.ArrayList(i128).init(allocator);
    var initial_seeds = std.ArrayList(Range).init(allocator);
    // Parse First line
    {
        _ = try in_stream.readUntilDelimiterOrEof(&buffer, '\n');
        var ind: usize = 7;
        while (ind < buffer.len and buffer[ind] != 0 and !is_line_end(buffer[ind])) : (ind += 1) {
            var seed_range: Range = .{};

            while (ind < buffer.len and buffer[ind] != 0 and !is_whitespace(buffer[ind])) : (ind += 1) {
                seed_range.start = seed_range.start * 10 + buffer[ind] - '0';
            }
            _ = try part_one_seeds.append(seed_range.start);
            ind += 1;

            var range: usize = 0;
            while (ind < buffer.len and buffer[ind] != 0 and !is_whitespace(buffer[ind])) : (ind += 1) {
                range = range * 10 + buffer[ind] - '0';
            }
            _ = try part_one_seeds.append(range);
            seed_range.end = seed_range.start + range - 1;
            _ = try initial_seeds.append(seed_range);
        }
    }

    // Parse Conversion Maps
    var current_converter: Conversions = @enumFromInt(@intFromEnum(Conversions.length) - 1);
    while (try in_stream.readUntilDelimiterOrEof(&buffer, '\n')) |line| {
        // advance map parse
        if (line.len == 0 or (line.len == 1 and is_whitespace(line[0]))) {
            current_converter = @enumFromInt((@intFromEnum(current_converter) + 1) %
                @intFromEnum(Conversions.length));

            // burn next line (ex: "seed-to-soil map")
            _ = try in_stream.readUntilDelimiterOrEof(&buffer, '\n');
            continue;
        }
        // now we should only be dealing with Map parsing
        var map: Map = .{};
        var ind: usize = 0;
        while (!is_whitespace(buffer[ind])) : (ind += 1) {
            map.dest = map.dest * 10 + buffer[ind] - '0';
        }
        ind += 1;
        while (!is_whitespace(buffer[ind])) : (ind += 1) {
            map.src = map.src * 10 + buffer[ind] - '0';
        }
        ind += 1;
        while (!is_whitespace(buffer[ind])) : (ind += 1) {
            map.range = map.range * 10 + buffer[ind] - '0';
        }

        _ = try conversions[@intFromEnum(current_converter)].append(map);
    }

    // Discover Solution to part 1
    var cur_min: i128 = std.math.maxInt(i128);
    for (part_one_seeds.items) |seed| {
        var val = seed;
        for (conversions) |maps| {
            val = remap(maps.items, val);
        }
        if (val < cur_min) cur_min = val;
    }
    std.debug.print("Part 1: {d}\n", .{cur_min});

    for (conversions) |maps| {
        _ = try remap_ranges(&initial_seeds, maps);
    }

    var min: i128 = std.math.maxInt(i128);
    for (initial_seeds.items) |range| {
        if (range.start < min) min = range.start;
    }

    std.debug.print("Part 2: {d}\n", .{min});
}

pub fn remap_ranges(ranges: *std.ArrayList(Range), maps: std.ArrayList(Map)) !void {
    // Compare each range to each map. If it overlaps, modify this range in place
    // and append the remainder range to the end of the ranges (for consideration later).
    // Then skip to next range, as I believe we are guaranteed to maps overlap
    // and move on. TODO: Come back to this if proven untrue.
    var i: usize = 0;
    range_loop: while (i < ranges.*.items.len) : (i += 1) {
        map_loop: for (maps.items) |map| {
            const overlap = split_overlap(ranges.*.items[i], map);
            switch (overlap.result_type) {
                .none => {
                    continue :map_loop;
                },
                .partial => {
                    ranges.*.items[i] = overlap.dest_overlap;
                    // std.debug.print("Remainder: ", .{});
                    // print_range(overlap.src_remainder);
                    // std.debug.print("\n", .{});
                    _ = try ranges.*.append(overlap.src_remainder);
                    continue :range_loop;
                },
                .full => {
                    ranges.*.items[i] = overlap.dest_overlap;
                    continue :range_loop;
                },
            }
        }
    }
}

const OverlapCase = enum(usize) {
    none, // the remap covers none of the source range
    partial, // the remap covers some of the source range
    full, // the remap covers entire source range
};

const OverlapResult = struct {
    result_type: OverlapCase = .none,
    dest_overlap: Range = undefined,
    src_remainder: Range = undefined,
};

// Breaks a range into the overlapping range in destination space and
// the leftover range in source space
pub fn split_overlap(src_range: Range, map: Map) OverlapResult {

    // Src Range goes from a to b in Dest space
    const src_to_dest = Range{
        .start = src_range.start - map.src + map.dest,
        .end = src_range.end - map.src + map.dest,
    };

    const dest_range = Range{
        .start = map.dest,
        .end = map.dest + map.range - 1,
    };

    const dest_overlap = Range{
        .start = @max(dest_range.start, src_to_dest.start),
        .end = @min(dest_range.end, src_to_dest.end),
    };

    if (dest_overlap.start > dest_overlap.end) {
        // std.debug.print("... no overlap.\n", .{});
        return .{ .result_type = .none };
    }

    if (dest_range.start <= src_to_dest.start and
        dest_range.end >= src_to_dest.end)
    {
        // std.debug.print("... full overlap.\n", .{});
        return .{
            .result_type = .full,
            .dest_overlap = dest_overlap,
        };
    }

    // left-sided overlap
    if (src_to_dest.start < dest_range.start) {
        // std.debug.print("... left overlap.\n", .{});
        return .{
            .result_type = .partial,
            .dest_overlap = dest_overlap,
            .src_remainder = .{
                .start = src_range.start,
                .end = dest_overlap.start - map.dest + map.src - 1,
            },
        };
    }

    // right-sided overlap
    // std.debug.print("... right overlap.\n", .{});
    return .{
        .result_type = .partial,
        .dest_overlap = dest_overlap,
        .src_remainder = .{
            .start = dest_overlap.end - map.dest + map.src + 1,
            .end = src_range.end,
        },
    };
}

pub fn print_range(range: Range) void {
    std.debug.print("[{d} - {d}]", .{ range.start, range.end });
}

const Conversions = enum(usize) {
    seed_to_soil,
    soil_to_fert,
    fert_to_water,
    water_to_light,
    light_to_temp,
    temp_to_hum,
    hum_to_loc,
    length,
};

const Map = struct {
    dest: i128 = 0,
    src: i128 = 0,
    range: i128 = 0,
};

const Range = struct {
    start: i128 = 0,
    end: i128 = 0,
};

pub inline fn is_whitespace(c: u8) bool {
    return c == ' ' or is_line_end(c);
}

pub inline fn is_line_end(c: u8) bool {
    return c == '\n' or c == '\r';
}

pub fn remap(maps: []Map, input: i128) i128 {
    for (maps) |map| {
        if (input >= map.src and input < map.src + map.range) {
            return input - map.src + map.dest;
        }
    }
    return input;
}

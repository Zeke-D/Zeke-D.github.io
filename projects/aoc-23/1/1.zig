const std = @import("std");
const print = std.debug.print;

pub fn is_digit(c: u8) bool {
    return c >= '1' and c <= '9';
}

pub inline fn digit_to_int(d: u8) u8 {
    return d - '0';
}

pub fn spelled_digit_value(line: []u8, start_ind: usize) u8 {
    if (start_ind <= @as(i128, line.len) - 3) {
        const str = line[start_ind..][0..3];
        if (std.mem.eql(u8, str, "one")) return 1;
        if (std.mem.eql(u8, str, "two")) return 2;
        if (std.mem.eql(u8, str, "six")) return 6;
    }

    if (start_ind <= @as(i128, line.len) - 4) {
        const str = line[start_ind..][0..4];
        if (std.mem.eql(u8, str, "four")) return 4;
        if (std.mem.eql(u8, str, "five")) return 5;
        if (std.mem.eql(u8, str, "nine")) return 9;
    }

    if (start_ind <= @as(i128, line.len) - 5) {
        const str = line[start_ind..][0..5];
        if (std.mem.eql(u8, str, "three")) return 3;
        if (std.mem.eql(u8, str, "seven")) return 7;
        if (std.mem.eql(u8, str, "eight")) return 8;
    }

    return 0;
}

pub fn line_value(line: []u8) u8 {
    var first_digit_ind: usize = 0;
    var first_val: u8 = 0;

    while (first_digit_ind < line.len) : (first_digit_ind += 1) {
        if (is_digit(line[first_digit_ind])) {
            first_val = digit_to_int(line[first_digit_ind]);
            break;
        }
        first_val = spelled_digit_value(line, first_digit_ind);
        if (first_val != 0) {
            break;
        }
    }

    // do the same thing from the back first
    var last_digit_ind: usize = line.len - 1;
    var last_val: u8 = 0;
    while (last_digit_ind >= first_digit_ind) : (last_digit_ind -= 1) {
        if (is_digit(line[last_digit_ind])) {
            last_val = digit_to_int(line[last_digit_ind]);
            break;
        }
        last_val = spelled_digit_value(line, last_digit_ind);
        if (last_val != 0) {
            break;
        }
    }

    return 10 * first_val + last_val;
}

pub fn main() !void {
    const file = try std.fs.cwd().openFile("1.in", .{ .mode = .read_only });
    defer file.close();

    var buf_reader = std.io.bufferedReader(file.reader());
    var in_stream = buf_reader.reader();
    var buffer: [1024]u8 = undefined;
    var sum: u32 = 0;
    while (try in_stream.readUntilDelimiterOrEof(&buffer, '\n')) |line| {
        const line_val = line_value(line);
        // print("Line val: {}\n", .{line_val});
        sum += line_val;
    }

    print("{d}\n", .{sum});
}

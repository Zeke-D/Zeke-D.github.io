const std = @import("std");

pub fn main() !void {
    const filename = "4.in";
    const file = try std.fs.cwd().openFile(filename, .{ .mode = .read_only });
    defer file.close();

    var buf_reader = std.io.bufferedReader(file.reader());
    var in_stream = buf_reader.reader();

    var buffer = [_]u8{0} ** 1024;
    var win_sum: u64 = 0;
    var scratch_sum: u64 = 0;
    var card: u8 = 0;

    const MAX_CARDS: usize = 204;
    var card_counts = [_]usize{1} ** MAX_CARDS;

    while (try in_stream.readUntilDelimiterOrEof(&buffer, '\n')) |line| {
        var ind: usize = 0;
        while (ind < line.len and line[ind] != ':') : (ind += 1) {}
        ind += 1;

        var winning_nums: [10]u8 = [_]u8{0} ** 10;
        var win_ind: usize = 0;
        while (ind < line.len and line[ind] != '|') : (ind += 1) {
            var num: u8 = 0;
            while (line[ind] == ' ') : (ind += 1) {}
            while (line[ind] != ' ') : (ind += 1) {
                num = num * 10 + line[ind] - '0';
            }
            winning_nums[win_ind] = num;
            win_ind += 1;
        }
        ind += 1;

        var win_num_count: u6 = 0;
        while (ind < line.len) : (ind += 1) {
            var num: u8 = 0;
            while (line[ind] == ' ') : (ind += 1) {}
            while (ind < line.len and line[ind] != ' ' and line[ind] != '\n' and line[ind] != '\r') : (ind += 1) {
                num = num * 10 + line[ind] - '0';
            }

            // check if num is a winning number
            for (winning_nums) |win| {
                if (win == num) {
                    win_num_count += 1;
                    break;
                }
            }
        }

        // std.debug.print("Card {d} has {d} wins.\n", .{ card + 1, win_num_count });
        if (win_num_count > 0) {
            win_sum += @as(u64, 1) << @as(u6, win_num_count - 1);
        }

        for (0..card_counts[card]) |_| {
            for (0..win_num_count) |num| {
                card_counts[card + num + 1] += 1;
            }
        }

        card += 1;
    }

    std.debug.print("Part 1: {d}\n", .{win_sum});

    for (0..card) |ind| {
        scratch_sum += card_counts[ind];
    }
    //std.debug.print("{any}\n", .{card_counts[0..card]});
    std.debug.print("Part 2: {d}\n", .{scratch_sum});
}

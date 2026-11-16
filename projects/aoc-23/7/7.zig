const std = @import("std");

pub fn main() !void {
    // Load hands
    // Sort hands
    // Sum bids * rank after sort
}

const CardError = error{Unrecognized_Card};
const Card = enum(usize) { Two = 0, Three, Four, Five, Six, Seven, Eight, Nine, Ten, Jack, Queen, King, Ace, len };
const CardChars = [_]u8{ '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A' };

const HandType = enum(usize) {
    Unset = 0,
    HighCard,
    OnePair,
    TwoPair,
    ThreeOfAKind,
    FullHouse,
    FourOfAKind,
    FiveOfAKind,
};

const Hand = struct {
    cards: [5]Card,
    bid: u128,

    pub fn init(card_string: *const [5]u8, bid: u128) !Hand {
        var hand = Hand{ .cards = undefined, .bid = bid };
        for (card_string, 0..) |char, ind| {
            hand.cards[ind] = try card_type(char);
        }
        return hand;
    }

    pub fn get_type(self: Hand) HandType {
        var card_counts: [@intFromEnum(Card.len)]u3 = .{0} ** @intFromEnum(Card.len);
        for (self.cards) |card| {
            card_counts[@intFromEnum(card)] += 1;
        }

        var hand_type = HandType.Unset;
        for (card_counts) |count| {
            switch (count) {
                0 => continue,
                1 => {
                    switch (hand_type) {
                        .Unset => {
                            hand_type = .HighCard;
                        },
                        else => continue,
                    }
                },
                2 => {
                    switch (hand_type) {
                        .Unset, .HighCard => {
                            hand_type = .OnePair;
                        },
                        .OnePair => {
                            hand_type = .TwoPair;
                        },
                        .ThreeOfAKind => {
                            hand_type = .FullHouse;
                        },
                        else => unreachable,
                    }
                },
                3 => {
                    switch (hand_type) {
                        .Unset, .HighCard => {
                            hand_type = .ThreeOfAKind;
                        },
                        .OnePair => {
                            hand_type = .FullHouse;
                        },
                        else => unreachable,
                    }
                },
                4 => {
                    switch (hand_type) {
                        .Unset, .HighCard => {
                            hand_type = .FourOfAKind;
                        },
                        else => unreachable,
                    }
                },
                5 => {
                    switch (hand_type) {
                        .Unset, .HighCard => {
                            hand_type = .FiveOfAKind;
                        },
                        else => unreachable,
                    }
                },
                else => unreachable,
            }
        }
        return hand_type;
    }
};

// returns True if hand b beats hand a
pub fn b_beats_a(_: anytype, a: Hand, b: Hand) bool {
    const b_hand_type = b.get_type();
    const a_hand_type = a.get_type();

    if (a_hand_type != b_hand_type) {
        return @intFromEnum(b_hand_type) > @intFromEnum(a_hand_type);
    }

    // Tie Breaker
    for (0..a.cards.len) |i| {
        if (a.cards[i] != b.cards[i]) {
            return @intFromEnum(b.cards[i]) > @intFromEnum(a.cards[i]);
        }
    }

    // Two identical hands should be impossible.
    unreachable;
    // alternatively, return false, as self does not beat self.
}

pub fn card_type(char: u8) CardError!Card {
    for (CardChars, 0..) |card_char, ind| {
        if (char == card_char) return @enumFromInt(ind);
    }
    return CardError.Unrecognized_Card;
}

test "building hands" {
    const hand_one = try Hand.init("22333", 420);
    try std.testing.expect(std.mem.eql(
        Card,
        &hand_one.cards,
        &[_]Card{ .Two, .Two, .Three, .Three, .Three },
    ));

    var hand_two = try Hand.init("ATJTJ", 69);
    try std.testing.expect(std.mem.eql(
        Card,
        &hand_two.cards,
        &[_]Card{ .Ace, .Ten, .Jack, .Ten, .Jack },
    ));

    try std.testing.expect(hand_one.get_type() == .FullHouse);
    try std.testing.expect(hand_two.get_type() == .TwoPair);
    try std.testing.expect(!b_beats_a(void, hand_one, hand_two));
    try std.testing.expect(b_beats_a(void, hand_two, hand_one));

    hand_two = try Hand.init("33322", hand_two.bid);
    try std.testing.expect(std.mem.eql(
        Card,
        &hand_two.cards,
        &[_]Card{ .Three, .Three, .Three, .Two, .Two },
    ));
    try std.testing.expect(b_beats_a(void, hand_one, hand_two));
}

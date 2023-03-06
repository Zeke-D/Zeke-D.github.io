package main

import "core:fmt"
import "core:os"
import "core:slice"
import "core:strings"
import "core:strconv"

Crate :: struct {
	label: rune,
	next: ^Crate,
}

Stack :: struct {
	start: ^Crate,
	count: uint,
}

// 1-indexed
StackIndex :: uint
normalize :: proc(si: StackIndex) -> uint {
	return si - 1
}

State :: struct {
	stacks: []Stack,
	instructions: [dynamic]Instruction,
}

Instruction :: struct {
	count: uint,
	from:  StackIndex,
	to:    StackIndex,
}

main :: proc() {

	fileString, ok := fileToString("5.in")
	if !ok {
		fmt.println("Oof.")
		return;
	}

	state := parseInput(fileString)
	for instr in state.instructions do execInstruction(&state, instr)

	// print the heads of each stack
	for stack in state.stacks do fmt.print(stack.start.label)
	fmt.println()
	
}

// debug function for printing contents of a stack
printStack :: proc(stack: Stack) {
	for crate := stack.start; crate != nil; crate = crate.next {
		fmt.print(crate.label)
	}
	fmt.println()
}

execInstruction :: proc(state: ^State, instruction: Instruction) {

	fromStack := &state.stacks[normalize(instruction.from)]
	toStack   := &state.stacks[normalize(instruction.to)]

	MACHINE_VERSION := 9001

	if MACHINE_VERSION <= 9000 {
		// Crates 1 by 1
		for i : uint = 0; i < instruction.count; i+=1 { 
			nextCrate := fromStack.start.next
			fromStack.start.next = toStack.start
			toStack.start = fromStack.start
			fromStack.start = nextCrate
		}
	}
	else {
		// Crates all at once
		nextHead := fromStack.start
		lastOfFrom : ^Crate = nil

		for i : uint = 0; nextHead != nil && i < instruction.count; i += 1 {
			lastOfFrom = nextHead
			nextHead = nextHead.next
		}

		lastOfFrom.next = toStack.start
		toStack.start = fromStack.start
		fromStack.start = nextHead
	}

	// Housekeeping (unnecessary)
	fromStack.count -= instruction.count
	toStack.count   += instruction.count
}


addCrateToEnd :: proc(stack: ^Stack, crate_p: ^Crate) {
	stack.count += 1

	if stack.start == nil {
		stack.start = crate_p;
		return
	}

	crate : ^Crate
	// march to end of stack
	for crate = stack.start; crate.next != nil; crate = crate.next {}
	crate.next = crate_p;
}

// the less interesting bits of parsing the file
fileToString :: proc(filepath: string) -> (string, bool) {
	data, ok := os.read_entire_file(filepath)
	if !ok {
		fmt.println("Error reading file.")
		return "", false
	}
	defer delete(data)
	return string(data), true
}


ParseState :: enum {
	Init,
	Read_Crates,
	Ignore_Two_Lines,
	Read_Instructions,
	End,
}

parseCratesFromLine :: proc(line: string) -> ([]Crate, []StackIndex) {
	crates_dyn    : [dynamic]Crate
	stackInds_dyn : [dynamic]StackIndex
	n := 0

	for i in 0 ..< len(line) {
		currentInd : uint = uint(i) / 4
		char : rune = rune(line[i])
		if strings.contains_rune("[ ]", char) == -1 {
			n += 1
			append(&crates_dyn, Crate{char, nil})
			append(&stackInds_dyn, currentInd)
		}
	}

	crates    := make([]Crate, n)
	stackInds := make([]StackIndex, n)

	for i in 0..<n {
		crates[i] = crates_dyn[i]
		stackInds[i] = stackInds_dyn[i]
	}

	return crates, stackInds
}

parseInstruction :: proc(line: string) -> Instruction {
	splitInput := strings.split(line, " ")
	return Instruction{
		uint(strconv.atoi(splitInput[1])),
		uint(strconv.atoi(splitInput[3])),
		uint(strconv.atoi(splitInput[5])),
	}
}

parseInput :: proc(input: string) -> (crateState: State) {
	
	parseState : ParseState = .Init
	numStacks : int

	for line in strings.split_lines(input) {
		switch (parseState) {

			case .Init:
				// len = 4n - 1
				numStacks = (len(line) + 1) / 4
				crateState.stacks = make([]Stack, numStacks)
				parseState = .Read_Crates

				fallthrough

			case .Read_Crates:
				// check to see if we advanced
				if rune(line[0]) == ' ' {
					parseState = .Ignore_Two_Lines
					continue
				}

				crates, stackInds := parseCratesFromLine(line)
				for i in 0 ..< len(crates) do addCrateToEnd(&crateState.stacks[stackInds[i]], &crates[i])

			case .Ignore_Two_Lines:
				parseState = .Read_Instructions
				continue

			case .Read_Instructions:
				if len(line) == 0 {
					parseState = .End
					continue
				}
				append(&crateState.instructions, parseInstruction(line))
			case .End:
		}
	}

	if parseState == .End do fmt.println("Parsed file into state.")
	else do fmt.println("Error parsing file into state")

	return
}
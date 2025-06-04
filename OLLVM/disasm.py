def disasm(bytecode):
    i = 0
    while i < len(bytecode):
        op = bytecode[i]
        if op == 0x01:
            print(f"{i:02X}: LOAD r{bytecode[i+1]}, {bytecode[i+2]}")
            i += 3
        elif op == 0x02:
            print(f"{i:02X}: ADD r{bytecode[i+1]}, r{bytecode[i+2]}")
            i += 3
        elif op == 0x03:
            print(f"{i:02X}: MUL r{bytecode[i+1]}, {bytecode[i+2]}")
            i += 3
        elif op == 0x04:
            print(f"{i:02X}: CMP r{bytecode[i+1]}, {bytecode[i+2]}")
            i += 3
        elif op == 0x05:
            print(f"{i:02X}: JE {bytecode[i+1]}")
            i += 2
        elif op == 0x06:
            print(f"{i:02X}: RET r{bytecode[i+1]}")
            i += 2

bytecode = [
    0x01, 0x00, 0xFF,
    0x01, 0x01, 0xFE,
    0x03, 0x00, 0x02,
    0x02, 0x00, 0x01,
    0x04, 0x00, 0x0A,
    0x05, 0x15,
    0x01, 0x02, 0x00,
    0x06, 0x02,
    0x01, 0x02, 0x01,
    0x06, 0x02
]

disasm(bytecode)
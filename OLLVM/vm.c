#include <stdio.h>

int run_vm(unsigned char *code, int arg0, int arg1) {
    int r[4] = {0};  // 虚拟寄存器
    int ip = 0;      // 指令指针
    while (1) {
        unsigned char op = code[ip++];
        switch (op) {
            case 0x01: { // LOAD
                int reg = code[ip++];
                int val = code[ip++];
                if (val == 0xFF) val = arg0;
                if (val == 0xFE) val = arg1;
                r[reg] = val;
                break;
            }
            case 0x02: { // ADD
                int dst = code[ip++];
                int src = code[ip++];
                r[dst] += r[src];
                break;
            }
            case 0x03: { // MUL
                int dst = code[ip++];
                int imm = code[ip++];
                r[dst] *= imm;
                break;
            }
            case 0x04: { // CMP
                int reg = code[ip++];
                int imm = code[ip++];
                r[3] = (r[reg] == imm); // r3做flag
                break;
            }
            case 0x05: { // JE
                int offset = code[ip++];
                if (r[3]) ip = offset;
                break;
            }
            case 0x06: { // RET
                int reg = code[ip++];
                return r[reg];
            }
            default:
                return -1;
        }
    }
}
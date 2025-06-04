#include <stdio.h>

int run_vm(unsigned char *code, int arg0, int arg1);

unsigned char bytecode[] = {
    0x01, 0x00, 0xFF,   // LOAD r0, arg0
    0x01, 0x01, 0xFE,   // LOAD r1, arg1
    0x03, 0x00, 0x02,   // MUL r0, 2
    0x02, 0x00, 0x01,   // ADD r0, r1
    0x04, 0x00, 0x0A,   // CMP r0, 10
    0x05, 0x15,         // JE offset=0x15
    0x01, 0x02, 0x00,   // LOAD r2, 0
    0x06, 0x02,         // RET r2
    0x01, 0x02, 0x01,   // LOAD r2, 1
    0x06, 0x02          // RET r2
};

int main() {
    int x = 3;
    int y = 4;
    int result = run_vm(bytecode, x, y);
    printf("Result = %d\n", result);
    return 0;
}
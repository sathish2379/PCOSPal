export const config = {
  root_directory: "../workspace",
  local_file_system_json_filename: "local_fs.json",
  riscv_gcc_path: "/opt/riscv64_ima_linux/bin/riscv64-unknown-linux-gnu-gcc",
  zeno_llvm_path: "/opt/llvm-capability/bin/clang",
  destinationBoardpath: "~",
};

export const defaults = {
  tmpBoardId: "1",
  tmpPort: "/dev/ttyUSB0",
  tmpRate: "115200",
};

{
  description = "Dev shell for Vimophone";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs
          prettierd
          tailwindcss-language-server
          typescript-language-server
          vscode-langservers-extracted
        ];
      };
    }
  );
}

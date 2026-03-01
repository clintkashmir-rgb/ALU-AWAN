
{ pkgs, ... }: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
    pkgs.zulu
    pkgs.firebase-tools
  ];
  idx.previews = {
    enable = true;
    previews = {
      web = {
        command = [ "npm" "run" "dev" "--" "--port" "$PORT" "--hostname" "0.0.0.0" ];
        manager = "web";
      };
    };
  };
}

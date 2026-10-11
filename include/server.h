#pragma once

#include <endstone/endstone.hpp>
#include <endstone/event/server/server_list_ping_event.h>
#include <endstone/event/player/player_chat_event.h>

#include <atomic>
#include <cstdint>
#include <memory>
#include <mutex>
#include <string>
#include <thread>
#include <string_view>

namespace httplib {
    class Server;
}

class WebPlugin;

class WebServer {
public:
    explicit WebServer(WebPlugin& plugin);

    ~WebServer();

    bool start();

    void stop();

    void updateServerStatus(
        const endstone::ServerListPingEvent& event
    );

    void recordPlayerMessage(endstone::PlayerChatEvent& event);

private:
    bool load_config();

    void setup_routes();

    void run();

    bool read_file(
        const std::string& path,
        std::string& output
    );

    void setup_player_routes();

private:
    WebPlugin& plugin_;

    endstone::Logger& logger_;

    std::unique_ptr<httplib::Server> server_;

    std::thread server_thread_;

    std::atomic<bool> running_{false};

    std::string host_ = "0.0.0.0";

    int port_ = 8080;

    // ========================================================
    // Minecraft Server Status
    // ========================================================

    std::mutex status_mutex_;

    std::string motd_;

    std::string level_name_;

    std::int64_t id_seed_ = 0;

    int game_port_ = 19132;

    int online_players_ = 0;

    int max_players_ = 0;

    int protocol_version_ = 0;

    std::string minecraft_version_;

    std::string server_version_;

    std::string server_name_;

    static int healthBar(
        int health,
        int max_health
    );

    static std::string formatPlayTime(
        std::int64_t seconds
    );
};

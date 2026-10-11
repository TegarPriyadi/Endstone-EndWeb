#pragma once

#include <endstone/endstone.hpp>
#include <endstone/event/player/player_chat_event.h>

#include <memory>
#include <atomic>
#include <thread>

#include "player_database.h"
#include "message_database.h"

class WebServer;

class WebPlugin : public endstone::Plugin {
public:

    void onLoad() override;

    void onEnable() override;

    void onDisable() override;

    void onServerListPing(
        endstone::ServerListPingEvent& event
    );

    void onPlayerJoin(
        endstone::PlayerJoinEvent& event
    );


    void onPlayerQuit(
        endstone::PlayerQuitEvent& event
    );


    void onPlayerDeath(
        endstone::PlayerDeathEvent& event
    );


    void onActorDeath(
        endstone::ActorDeathEvent& event
    );

    void onPlayerChat(
        endstone::PlayerChatEvent& event
    );


    // ========================================================
    // Database
    // ========================================================

    PlayerDatabase& getPlayerDatabase()
    {
        return *player_database_;
    }

    MessageDatabase& getMessageDatabase()
    {
        return message_database_;
    }

private:

    bool extractResources();

    MessageDatabase message_database_;

private:

    std::unique_ptr<PlayerDatabase> player_database_;

    std::unique_ptr<WebServer> web_server_;

    std::atomic<bool> cleanup_running_{false};
    
    std::thread cleanup_thread_;
};

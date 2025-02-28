// This file is generated by TypeBuilder_cpp.template.

// Copyright (c) 2016 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "src/inspector/protocol/Console.h"

#include "src/inspector/protocol/Protocol.h"

#include "third_party/inspector_protocol\crdtp/cbor.h"
#include "third_party/inspector_protocol\crdtp/find_by_first.h"
#include "third_party/inspector_protocol\crdtp/span.h"

namespace v8_inspector {
namespace protocol {
namespace Console {

using v8_crdtp::DeserializerState;
using v8_crdtp::ProtocolTypeTraits;

// ------------- Enum values from types.

const char Metainfo::domainName[] = "Console";
const char Metainfo::commandPrefix[] = "Console.";
const char Metainfo::version[] = "1.3";


const char* ConsoleMessage::SourceEnum::Xml = "xml";
const char* ConsoleMessage::SourceEnum::Javascript = "javascript";
const char* ConsoleMessage::SourceEnum::Network = "network";
const char* ConsoleMessage::SourceEnum::ConsoleApi = "console-api";
const char* ConsoleMessage::SourceEnum::Storage = "storage";
const char* ConsoleMessage::SourceEnum::Appcache = "appcache";
const char* ConsoleMessage::SourceEnum::Rendering = "rendering";
const char* ConsoleMessage::SourceEnum::Security = "security";
const char* ConsoleMessage::SourceEnum::Other = "other";
const char* ConsoleMessage::SourceEnum::Deprecation = "deprecation";
const char* ConsoleMessage::SourceEnum::Worker = "worker";

const char* ConsoleMessage::LevelEnum::Log = "log";
const char* ConsoleMessage::LevelEnum::Warning = "warning";
const char* ConsoleMessage::LevelEnum::Error = "error";
const char* ConsoleMessage::LevelEnum::Debug = "debug";
const char* ConsoleMessage::LevelEnum::Info = "info";
V8_CRDTP_BEGIN_DESERIALIZER(ConsoleMessage)
    V8_CRDTP_DESERIALIZE_FIELD_OPT("column", m_column),
    V8_CRDTP_DESERIALIZE_FIELD("level", m_level),
    V8_CRDTP_DESERIALIZE_FIELD_OPT("line", m_line),
    V8_CRDTP_DESERIALIZE_FIELD("source", m_source),
    V8_CRDTP_DESERIALIZE_FIELD("text", m_text),
    V8_CRDTP_DESERIALIZE_FIELD_OPT("url", m_url),
V8_CRDTP_END_DESERIALIZER()

V8_CRDTP_BEGIN_SERIALIZER(ConsoleMessage)
    V8_CRDTP_SERIALIZE_FIELD("source", m_source);
    V8_CRDTP_SERIALIZE_FIELD("level", m_level);
    V8_CRDTP_SERIALIZE_FIELD("text", m_text);
    V8_CRDTP_SERIALIZE_FIELD("url", m_url);
    V8_CRDTP_SERIALIZE_FIELD("line", m_line);
    V8_CRDTP_SERIALIZE_FIELD("column", m_column);
V8_CRDTP_END_SERIALIZER();


// ------------- Enum values from params.


// ------------- Frontend notifications.

void Frontend::messageAdded(std::unique_ptr<protocol::Console::ConsoleMessage> message)
{
    if (!frontend_channel_)
        return;
    v8_crdtp::ObjectSerializer serializer;
    serializer.AddField(v8_crdtp::MakeSpan("message"), message);
    frontend_channel_->SendProtocolNotification(v8_crdtp::CreateNotification("Console.messageAdded", serializer.Finish()));
}

void Frontend::flush()
{
    frontend_channel_->FlushProtocolNotifications();
}

void Frontend::sendRawNotification(std::unique_ptr<Serializable> notification)
{
    frontend_channel_->SendProtocolNotification(std::move(notification));
}

// --------------------- Dispatcher.

class DomainDispatcherImpl : public protocol::DomainDispatcher {
public:
    DomainDispatcherImpl(FrontendChannel* frontendChannel, Backend* backend)
        : DomainDispatcher(frontendChannel)
        , m_backend(backend) {}
    ~DomainDispatcherImpl() override { }

    using CallHandler = void (DomainDispatcherImpl::*)(const v8_crdtp::Dispatchable& dispatchable);

    std::function<void(const v8_crdtp::Dispatchable&)> Dispatch(v8_crdtp::span<uint8_t> command_name) override;

    void clearMessages(const v8_crdtp::Dispatchable& dispatchable);
    void disable(const v8_crdtp::Dispatchable& dispatchable);
    void enable(const v8_crdtp::Dispatchable& dispatchable);
 protected:
    Backend* m_backend;
};

namespace {
// This helper method with a static map of command methods (instance methods
// of DomainDispatcherImpl declared just above) by their name is used immediately below,
// in the DomainDispatcherImpl::Dispatch method.
DomainDispatcherImpl::CallHandler CommandByName(v8_crdtp::span<uint8_t> command_name) {
  static auto* commands = [](){
    auto* commands = new std::vector<std::pair<v8_crdtp::span<uint8_t>,
                              DomainDispatcherImpl::CallHandler>>{
    {
          v8_crdtp::SpanFrom("clearMessages"),
          &DomainDispatcherImpl::clearMessages
    },
    {
          v8_crdtp::SpanFrom("disable"),
          &DomainDispatcherImpl::disable
    },
    {
          v8_crdtp::SpanFrom("enable"),
          &DomainDispatcherImpl::enable
    },
    };
    return commands;
  }();
  return v8_crdtp::FindByFirst<DomainDispatcherImpl::CallHandler>(*commands, command_name, nullptr);
}
}  // namespace

std::function<void(const v8_crdtp::Dispatchable&)> DomainDispatcherImpl::Dispatch(v8_crdtp::span<uint8_t> command_name) {
  CallHandler handler = CommandByName(command_name);
  if (!handler) return nullptr;

  return [this, handler](const v8_crdtp::Dispatchable& dispatchable) {
    (this->*handler)(dispatchable);
  };
}


namespace {


}  // namespace

void DomainDispatcherImpl::clearMessages(const v8_crdtp::Dispatchable& dispatchable)
{
    // Prepare input parameters.


    std::unique_ptr<DomainDispatcher::WeakPtr> weak = weakPtr();
    DispatchResponse response = m_backend->clearMessages();
    if (response.IsFallThrough()) {
        channel()->FallThrough(dispatchable.CallId(), v8_crdtp::SpanFrom("Console.clearMessages"), dispatchable.Serialized());
        return;
    }
    if (weak->get())
        weak->get()->sendResponse(dispatchable.CallId(), response);
    return;
}

namespace {


}  // namespace

void DomainDispatcherImpl::disable(const v8_crdtp::Dispatchable& dispatchable)
{
    // Prepare input parameters.


    std::unique_ptr<DomainDispatcher::WeakPtr> weak = weakPtr();
    DispatchResponse response = m_backend->disable();
    if (response.IsFallThrough()) {
        channel()->FallThrough(dispatchable.CallId(), v8_crdtp::SpanFrom("Console.disable"), dispatchable.Serialized());
        return;
    }
    if (weak->get())
        weak->get()->sendResponse(dispatchable.CallId(), response);
    return;
}

namespace {


}  // namespace

void DomainDispatcherImpl::enable(const v8_crdtp::Dispatchable& dispatchable)
{
    // Prepare input parameters.


    std::unique_ptr<DomainDispatcher::WeakPtr> weak = weakPtr();
    DispatchResponse response = m_backend->enable();
    if (response.IsFallThrough()) {
        channel()->FallThrough(dispatchable.CallId(), v8_crdtp::SpanFrom("Console.enable"), dispatchable.Serialized());
        return;
    }
    if (weak->get())
        weak->get()->sendResponse(dispatchable.CallId(), response);
    return;
}

namespace {
// This helper method (with a static map of redirects) is used from Dispatcher::wire
// immediately below.
const std::vector<std::pair<v8_crdtp::span<uint8_t>, v8_crdtp::span<uint8_t>>>& SortedRedirects() {
  static auto* redirects = [](){
    auto* redirects = new std::vector<std::pair<v8_crdtp::span<uint8_t>, v8_crdtp::span<uint8_t>>>{
    };
    return redirects;
  }();
  return *redirects;
}
}  // namespace

// static
void Dispatcher::wire(UberDispatcher* uber, Backend* backend)
{
    auto dispatcher = std::make_unique<DomainDispatcherImpl>(uber->channel(), backend);
    uber->WireBackend(v8_crdtp::SpanFrom("Console"), SortedRedirects(), std::move(dispatcher));
}

} // Console
} // namespace v8_inspector
} // namespace protocol

import { Layout } from "@/components/layout/Layout";
import { Archive } from "@/pages/Archive";
import DefaultPassChanger from "@/pages/DefaultPassChanger";
import Login from "@/pages/login/Login";
import Alarm from "@/pages/settings/alarm/Alarm";
import { Alerts } from "@/pages/settings/alarm/Alerts";
import ContactClosure from "@/pages/settings/alarm/ContactClosure";
import MotionDetector from "@/pages/settings/alarm/MotionDetector";
import { WhiteLight } from "@/pages/settings/alarm/WhiteLight";
import Channel from "@/pages/settings/channel/Channel";
import HiddenAreas from "@/pages/settings/channel/HiddenAreas";
import { ImageComponent } from "@/pages/settings/channel/ImageComponent";
import Titles from "@/pages/settings/channel/Titles";
import { Email } from "@/pages/settings/network/alert-protocols/Email";
import { FTP } from "@/pages/settings/network/alert-protocols/FTP";
import { Push } from "@/pages/settings/network/alert-protocols/Push";
import { Telegram } from "@/pages/settings/network/alert-protocols/Telegram";
import { AlertProtocols } from "@/pages/settings/network/AlertProtocols";
import { Common } from "@/pages/settings/network/Common";
import { Auth8021x } from "@/pages/settings/network/common/Auth8021x";
import { HTTP } from "@/pages/settings/network/common/HTTP";
import { HTTPS } from "@/pages/settings/network/common/HTTPS";
import { Multicast } from "@/pages/settings/network/common/Multicast";
import { P2pIpEye } from "@/pages/settings/network/common/P2pIpEye";
import { QoS } from "@/pages/settings/network/common/QoS";
import { RtmpPush } from "@/pages/settings/network/common/RtmpPush";
import { RTSP } from "@/pages/settings/network/common/RTSP";
import IpFilter from "@/pages/settings/network/IpFilter";
import Network from "@/pages/settings/network/Network";
import Protocols from "@/pages/settings/network/Protocols";
import { SNMP } from "@/pages/settings/network/SNMP";
import Vipnet from "@/pages/settings/network/Vipnet";
import { Settings } from "@/pages/settings/Settings";
import { Local } from "@/pages/settings/storage/Local";
import Record from "@/pages/settings/storage/Record";
import { StorageComponent } from "@/pages/settings/storage/StorageComponent";
import { About } from "@/pages/settings/system/about/About";
import DateTime from "@/pages/settings/system/DateTime";
import Disks from "@/pages/settings/system/Disks";
import ImportExport from "@/pages/settings/system/service/ImportExport";
import Reboot from "@/pages/settings/system/service/Reboot";
import Reset from "@/pages/settings/system/service/Reset";
import Service from "@/pages/settings/system/service/Service";
import { Upgrade } from "@/pages/settings/system/service/Upgrade";
import System from "@/pages/settings/system/System";
import Users from "@/pages/settings/system/Users";
import { AudioComponent } from "@/pages/settings/thread/AudioComponent";
import Thread from "@/pages/settings/thread/Thread";
import { Video } from "@/pages/settings/thread/Video";
import Stream from "@/pages/Stream";
import { RequireAuth } from "@/service/auth/RequireAuth";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const RouterController = () => (
   <BrowserRouter>
      <Routes>
         <Route element={<Layout />}>
            <Route path="/" element={<Login />} />
            <Route path="/change-default" element={<DefaultPassChanger />} />
            <Route
               path="/stream"
               element={
                  <RequireAuth>
                     <Stream />
                  </RequireAuth>
               }
            />
            <Route
               path="/archive"
               element={
                  <RequireAuth>
                     <Archive />
                  </RequireAuth>
               }
            />
            <Route
               path="/settings"
               element={
                  <RequireAuth>
                     <Settings />
                  </RequireAuth>
               }>
               <Route path="channel" element={<Channel />}>
                  <Route path="titles" element={<Titles />} />
                  <Route path="image" element={<ImageComponent />} />
                  <Route path="hidden_areas" element={<HiddenAreas />} />
                  <Route path="*" element={<Navigate replace to="titles" />} />
               </Route>
               <Route path="thread" element={<Thread />}>
                  <Route path="video" element={<Video />} />
                  <Route path="audio" element={<AudioComponent />} />
               </Route>
               <Route path="alarm" element={<Alarm />}>
                  <Route path="motion_detector" element={<MotionDetector />} />
                  <Route path="contact_closure" element={<ContactClosure />} />
                  <Route path="alerts" element={<Alerts />} />
                  <Route path="white_light" element={<WhiteLight />} />
               </Route>
               <Route path="storage" element={<StorageComponent />}>
                  <Route path="record" element={<Record />} />
                  <Route path="local" element={<Local />} />
               </Route>
               <Route path="network" element={<Network />}>
                  <Route path="common" element={<Common />} />
                  <Route path="alertProtocols" element={<AlertProtocols />}>
                     <Route path="push" element={<Push />} />
                     <Route path="telegram" element={<Telegram />} />
                     <Route path="email" element={<Email />} />
                     <Route path="ftp" element={<FTP />} />
                  </Route>

                  <Route path="protocols" element={<Protocols />}>
                     <Route path="rtsp" element={<RTSP />} />
                     <Route path="http" element={<HTTP />} />
                     <Route path="https" element={<HTTPS />} />
                     <Route path="multicast" element={<Multicast />} />
                     <Route path="rtmp_push" element={<RtmpPush />} />
                     <Route path="qos" element={<QoS />} />
                     <Route path="p2p_ipeye" element={<P2pIpEye />} />
                     <Route path="auth_802_1x" element={<Auth8021x />} />
                     <Route path="snmp" element={<SNMP />} />
                  </Route>

                  <Route path="vipnet" element={<Vipnet />} />
                  <Route path="ip_filter" element={<IpFilter />} />
               </Route>
               <Route path="system" element={<System />}>
                  <Route path="datetime" element={<DateTime />} />
                  <Route path="disks" element={<Disks />} />
                  <Route path="users" element={<Users />} />
                  <Route path="service" element={<Service />}>
                     <Route path="upgrade" element={<Upgrade />} />
                     <Route path="reset" element={<Reset />} />
                     <Route path="reboot" element={<Reboot />} />
                     <Route path="import-export" element={<ImportExport />} />
                     <Route path="*" element={<Navigate replace to="upgrade" />} />
                  </Route>
                  <Route path="about" element={<About />} />
               </Route>
               <Route path="" element={<Navigate replace to="/settings/channel/titles" />} />
            </Route>
            <Route path="/*" element={<Navigate replace to="/" />} />
         </Route>
      </Routes>
   </BrowserRouter>
);

export default RouterController;

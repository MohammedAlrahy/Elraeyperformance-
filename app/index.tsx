import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Native from '@/modules/elraey-performance';
import { theme } from '@/constants/theme';

const fmtBytes = (n: number) => n >= 1024 ** 3 ? `${(n / 1024 ** 3).toFixed(1)} GB` : `${(n / 1024 ** 2).toFixed(0)} MB`;

export default function Home() {
  const [device, setDevice] = useState<any>(null);
  const [display, setDisplay] = useState<any>(null);
  const [battery, setBattery] = useState<any>(null);
  const [cpu, setCpu] = useState(0);
  const [snapshot, setSnapshot] = useState<any>(null);
  const snapshotRef = React.useRef<any>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const [d, di, b, c] = await Promise.all([Native.getDeviceInfo(), Native.getDisplayInfo(), Native.getBatteryInfo(), Native.getCpuSnapshot()]);
    setDevice(d); setDisplay(di); setBattery(b); setSnapshot(c);
  };
  useEffect(() => { load().catch(() => {}); const t = setInterval(async () => { try { const b = await Native.getBatteryInfo(); const previous = snapshotRef.current ?? { total: 0, idle: 0 }; const c = await Native.getCpuUsage(previous.total, previous.idle); setBattery(b); if (previous.total > 0) setCpu(c.usage); const next = { total: c.total, idle: c.idle }; snapshotRef.current = next; setSnapshot(next); } catch {} }, 2500); return () => clearInterval(t); }, []);

  const maxHz = useMemo(() => Math.max(...(display?.supportedRefreshRates ?? [0])), [display]);
  const boost = async () => { if (!maxHz) return; setBusy(true); try { Native.setPreferredRefreshRate(maxHz); await new Promise(r => setTimeout(r, 500)); await load(); } finally { setBusy(false); } };

  if (!device || !display) return <View style={s.center}><ActivityIndicator size="large" color={theme.accent}/><Text style={s.muted}>Reading device performance…</Text></View>;

  return <ScrollView style={s.root} contentContainerStyle={s.content}>
    <View style={s.header}><View><Text style={s.kicker}>ELRAEY</Text><Text style={s.title}>Performance</Text></View><View style={s.logo}><Ionicons name="flash" size={20} color={theme.accent}/></View></View>
    <View style={s.hero}>
      <View style={s.heroTop}><Text style={s.label}>DISPLAY FREQUENCY</Text><View style={s.live}><View style={s.dot}/><Text style={s.liveText}>LIVE</Text></View></View>
      <Text style={s.hz}>{Math.round(display.currentRefreshRate)}<Text style={s.hzUnit}> Hz</Text></Text>
      <Text style={s.sub}>Peak supported: {Math.round(maxHz)} Hz · {display.modes.length} display modes</Text>
      <Pressable style={({pressed}) => [s.primary, pressed && s.pressed]} onPress={boost} disabled={busy}>{busy ? <ActivityIndicator color="#06100C"/> : <><Ionicons name="rocket" size={18} color="#06100C"/><Text style={s.primaryText}>SET MAX REFRESH RATE</Text></>}</Pressable>
      <Pressable style={s.linkBtn} onPress={() => Native.openDisplaySettings()}><Text style={s.linkText}>Open Android display settings</Text><Ionicons name="chevron-forward" size={16} color={theme.accent}/></Pressable>
    </View>
    <View style={s.grid}>
      <Metric icon="speedometer" label="CPU" value={`${Math.round(cpu)}%`} />
      <Metric icon="hardware-chip" label="RAM FREE" value={fmtBytes(device.availableRamBytes)} />
      <Metric icon="thermometer" label="BATTERY" value={`${Math.round(battery?.temperatureC ?? 0)}°C`} />
      <Metric icon="battery-half" label="CHARGE" value={`${Math.round(battery?.percent ?? 0)}%`} />
    </View>
    <Text style={s.section}>PERFORMANCE CENTER</Text>
    <Action icon="game-controller" title="My Games" detail="Detect, add and launch installed games" onPress={() => router.push('/games')} />
    <Action icon="pulse" title="FPS Benchmark" detail="Measure rendering FPS and frame stability" onPress={() => router.push('/benchmark')} />
    <Action icon="settings" title="Performance Settings" detail="Refresh rate, permissions and device tools" onPress={() => router.push('/settings')} />
    <Text style={s.section}>DEVICE</Text>
    <View style={s.device}><Text style={s.deviceName}>{device.manufacturer} {device.model}</Text><Text style={s.muted}>Android {device.androidVersion} · API {device.apiLevel}</Text><Text style={s.muted}>{device.resolution} · {device.cpuCores} CPU cores · {device.cpuAbi}</Text></View>
  </ScrollView>;
}
function Metric({icon,label,value}:{icon:any;label:string;value:string}) { return <View style={s.metric}><Ionicons name={icon} size={18} color={theme.accent}/><Text style={s.label}>{label}</Text><Text style={s.metricValue}>{value}</Text></View> }
function Action({icon,title,detail,onPress}:{icon:any;title:string;detail:string;onPress:()=>void}) { return <Pressable style={({pressed})=>[s.action,pressed&&s.pressed]} onPress={onPress}><View style={s.actionIcon}><Ionicons name={icon} size={20} color={theme.accent}/></View><View style={{flex:1}}><Text style={s.actionTitle}>{title}</Text><Text style={s.muted}>{detail}</Text></View><Ionicons name="chevron-forward" size={18} color="#61706A"/></Pressable> }
const s=StyleSheet.create({root:{flex:1,backgroundColor:theme.bg},content:{padding:18,paddingTop:54,paddingBottom:40},center:{flex:1,backgroundColor:theme.bg,alignItems:'center',justifyContent:'center',gap:12},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:18},kicker:{color:theme.accent,fontSize:11,fontWeight:'900',letterSpacing:4},title:{color:theme.text,fontSize:30,fontWeight:'900'},logo:{width:42,height:42,borderRadius:14,borderWidth:1,borderColor:theme.border,backgroundColor:theme.panel,alignItems:'center',justifyContent:'center'},hero:{backgroundColor:theme.panel,padding:20,borderRadius:24,borderWidth:1,borderColor:theme.border,marginBottom:12},heroTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},label:{color:theme.muted,fontSize:10,fontWeight:'900',letterSpacing:1.5},live:{flexDirection:'row',gap:6,alignItems:'center'},dot:{width:6,height:6,borderRadius:6,backgroundColor:theme.accent},liveText:{color:theme.accent,fontSize:9,fontWeight:'900'},hz:{color:theme.text,fontSize:58,fontWeight:'900',marginTop:5},hzUnit:{fontSize:17,color:theme.accent},sub:{color:theme.muted,fontSize:12,marginBottom:16},primary:{height:52,borderRadius:15,backgroundColor:theme.accent,alignItems:'center',justifyContent:'center',flexDirection:'row',gap:8},primaryText:{color:'#06100C',fontWeight:'900',fontSize:12,letterSpacing:1},linkBtn:{marginTop:12,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:4},linkText:{color:theme.accent,fontSize:12,fontWeight:'700'},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},metric:{width:'48.5%',minHeight:94,padding:15,borderRadius:18,backgroundColor:theme.panel,borderWidth:1,borderColor:theme.border},metricValue:{color:theme.text,fontSize:22,fontWeight:'900',marginTop:6},section:{color:theme.muted,fontSize:10,fontWeight:'900',letterSpacing:1.8,marginTop:23,marginBottom:9},action:{backgroundColor:theme.panel,padding:13,borderRadius:18,borderWidth:1,borderColor:theme.border,flexDirection:'row',alignItems:'center',gap:12,marginBottom:8},actionIcon:{width:42,height:42,borderRadius:13,backgroundColor:'#0D2118',alignItems:'center',justifyContent:'center'},actionTitle:{color:theme.text,fontSize:15,fontWeight:'800',marginBottom:3},device:{backgroundColor:theme.panel,padding:17,borderRadius:18,borderWidth:1,borderColor:theme.border},deviceName:{color:theme.text,fontSize:18,fontWeight:'800',marginBottom:5},muted:{color:theme.muted,fontSize:11},pressed:{opacity:.72}});

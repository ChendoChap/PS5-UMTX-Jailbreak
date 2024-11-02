const OFFSET_wk_vtable_first_element     = 0x00314880;
const OFFSET_wk_memset_import            = 0x028DDEB8;
const OFFSET_wk___stack_chk_guard_import = 0x028DDB98;

const OFFSET_lk___stack_chk_guard        = 0x00069190;
const OFFSET_lk_pthread_create_name_np   = 0x0002CED0;
const OFFSET_lk_pthread_join             = 0x0002F460;
const OFFSET_lk_pthread_exit             = 0x00020A80;
const OFFSET_lk__thread_list             = 0x000601A8;
const OFFSET_lk_sleep                    = 0x00023340;
const OFFSET_lk_sceKernelGetCurrentCpu   = 0x00002C10;

const OFFSET_lc_memset                   = 0x00014B50;
const OFFSET_lc_setjmp                   = 0x0005F940;
const OFFSET_lc_longjmp                  = 0x0005F990;

const OFFSET_WORKER_STACK_OFFSET         = 0x0007FB88;

let wk_gadgetmap = {
    "ret"    : 0x00000042,
    "pop rdi": 0x00107342,
    "pop rsi": 0x00115923,
    "pop rdx": 0x002FFDF2,
    "pop rcx": 0x0009AC92,
    "pop r8": 0x0024A59F,
    "pop r9" : 0x00277B41,
    "pop rax": 0x0002C827,
    "pop rsp": 0x00099A22,

    "mov [rdi], rsi": 0x00A2D5B8, //check
    "mov [rdi], rax": 0x0003A79A,
    "mov [rdi], eax": 0x0003A79B,

    "infloop": 0x00007351,

    //branching specific gadgets
    "cmp [rcx], eax" : 0x00E4EEDB, //check
    "sete al"        : 0x00022549,
    "seta al"        : 0x0000C94F,
    "setb al"        : 0x0015E348,
    "setg al"        : 0x002F89AA,
    "setl al"        : 0x000E0D91,
    "shl rax, 3"     : 0x01A26823, //check
    "add rax, rcx"   : 0x000B0E59,
    "mov rax, [rax]" : 0x00047FEC,
    "inc dword [rax]": 0x004971AA,
};

let syscall_map = {
    0x001: 0x33B80, // sys_exit
    0x002: 0x34B30, // sys_fork
    0x003: 0x32D50, // sys_read
    0x004: 0x32CB0, // sys_write
    0x005: 0x33350, // sys_open
    0x006: 0x33980, // sys_close
    0x007: 0x32570, // sys_wait4
    0x00A: 0x34670, // sys_unlink
    0x00C: 0x34000, // sys_chdir
    0x00F: 0x33A00, // sys_chmod
    0x014: 0x32ED0, // sys_getpid
    0x017: 0x329D0, // sys_setuid
    0x018: 0x33FE0, // sys_getuid
    0x019: 0x33390, // sys_geteuid
    0x01B: 0x33430, // sys_recvmsg
    0x01C: 0x33660, // sys_sendmsg
    0x01D: 0x341B0, // sys_recvfrom
    0x01E: 0x328D0, // sys_accept
    0x01F: 0x326F0, // sys_getpeername
    0x020: 0x34810, // sys_getsockname
    0x021: 0x34330, // sys_access
    0x022: 0x344B0, // sys_chflags
    0x023: 0x33E80, // sys_fchflags
    0x024: 0x34D60, // sys_sync
    0x025: 0x33330, // sys_kill
    0x027: 0x32DD0, // sys_getppid
    0x029: 0x34390, // sys_dup
    0x02A: 0x32D20, // sys_pipe
    0x02B: 0x349D0, // sys_getegid
    0x02C: 0x34D20, // sys_profil
    0x02F: 0x32870, // sys_getgid
    0x031: 0x32850, // sys_getlogin
    0x032: 0x340E0, // sys_setlogin
    0x035: 0x32A90, // sys_sigaltstack
    0x036: 0x32BF0, // sys_ioctl
    0x037: 0x33EC0, // sys_reboot
    0x038: 0x33DC0, // sys_revoke
    0x03B: 0x340C0, // sys_execve
    0x041: 0x33A60, // sys_msync
    0x049: 0x33250, // sys_munmap
    0x04A: 0x33FC0, // sys_mprotect
    0x04B: 0x33140, // sys_madvise
    0x04E: 0x33310, // sys_mincore
    0x04F: 0x327D0, // sys_getgroups
    0x050: 0x32D70, // sys_setgroups
    0x053: 0x327B0, // sys_setitimer
    0x056: 0x325D0, // sys_getitimer
    0x059: 0x33E20, // sys_getdtablesize
    0x05A: 0x34230, // sys_dup2
    0x05C: 0x33860, // sys_fcntl
    0x05D: 0x333B0, // sys_select
    0x05F: 0x32810, // sys_fsync
    0x060: 0x33740, // sys_setpriority
    0x061: 0x32F90, // sys_socket
    0x062: 0x34020, // sys_connect
    0x063: 0x34990, // sys_netcontrol
    0x064: 0x32590, // sys_getpriority
    0x065: 0x345B0, // sys_netabort
    0x066: 0x34930, // sys_netgetsockinfo
    0x068: 0x34630, // sys_bind
    0x069: 0x338A0, // sys_setsockopt
    0x06A: 0x32B90, // sys_listen
    0x071: 0x33BA0, // sys_socketex
    0x072: 0x33570, // sys_socketclose
    0x074: 0x34D40, // sys_gettimeofday
    0x075: 0x34E20, // sys_getrusage
    0x076: 0x32550, // sys_getsockopt
    0x078: 0x337E0, // sys_readv
    0x079: 0x33640, // sys_writev
    0x07A: 0x34290, // sys_settimeofday
    0x07C: 0x331D0, // sys_fchmod
    0x07D: 0x33A40, // sys_netgetiflist
    0x07E: 0x34910, // sys_setreuid
    0x07F: 0x33530, // sys_setregid
    0x080: 0x34490, // sys_rename
    0x083: 0x334B0, // sys_flock
    0x085: 0x34D80, // sys_sendto
    0x086: 0x34BB0, // sys_shutdown
    0x087: 0x33F40, // sys_socketpair
    0x088: 0x33CE0, // sys_mkdir
    0x089: 0x32F30, // sys_rmdir
    0x08A: 0x32440, // sys_utimes
    0x08C: 0x348D0, // sys_adjtime
    0x08D: 0x33A20, // sys_kqueueex
    0x093: 0x33C80, // sys_setsid
    0x0A5: 0x32770, // sys_sysarch
    0x0B6: 0x34710, // sys_setegid
    0x0B7: 0x325B0, // sys_seteuid
    0x0BC: 0x34770, // sys_stat
    0x0BD: 0x34B70, // sys_fstat
    0x0BE: 0x33550, // sys_lstat
    0x0BF: 0x32C50, // sys_pathconf
    0x0C0: 0x33F00, // sys_fpathconf
    0x0C2: 0x33490, // sys_getrlimit
    0x0C3: 0x33070, // sys_setrlimit
    0x0C4: 0x34690, // sys_getdirentries
    0x0CA: 0x34470, // sys___sysctl
    0x0CB: 0x33B20, // sys_mlock
    0x0CC: 0x34510, // sys_munlock
    0x0CE: 0x32FD0, // sys_futimes
    0x0D1: 0x335B0, // sys_poll
    0x0E8: 0x32670, // sys_clock_gettime
    0x0E9: 0x33AE0, // sys_clock_settime
    0x0EA: 0x34AE0, // sys_clock_getres
    0x0EB: 0x346B0, // sys_ktimer_create
    0x0EC: 0x32E30, // sys_ktimer_delete
    0x0ED: 0x34B90, // sys_ktimer_settime
    0x0EE: 0x34040, // sys_ktimer_gettime
    0x0EF: 0x331F0, // sys_ktimer_getoverrun
    0x0F0: 0x34570, // sys_nanosleep
    0x0F1: 0x33DA0, // sys_ffclock_getcounter
    0x0F2: 0x32D90, // sys_ffclock_setestimate
    0x0F3: 0x33C20, // sys_ffclock_getestimate
    0x0F7: 0x34610, // sys_clock_getcpuclockid2
    0x0FD: 0x341D0, // sys_issetugid
    0x110: 0x34970, // sys_getdents
    0x121: 0x34080, // sys_preadv
    0x122: 0x335D0, // sys_pwritev
    0x136: 0x332D0, // sys_getsid
    0x13B: 0x34790, // sys_aio_suspend
    0x144: 0x32E50, // sys_mlockall
    0x145: 0x34250, // sys_munlockall
    0x147: 0x32F50, // sys_sched_setparam
    0x148: 0x33BC0, // sys_sched_getparam
    0x149: 0x32710, // sys_sched_setscheduler
    0x14A: 0x33590, // sys_sched_getscheduler
    0x14B: 0x333F0, // sys_sched_yield
    0x14C: 0x32990, // sys_sched_get_priority_max
    0x14D: 0x32AB0, // sys_sched_get_priority_min
    0x14E: 0x32CE0, // sys_sched_rr_get_interval
    0x154: 0x324A0, // sys_sigprocmask
    0x155: 0x324E0, // sys_sigsuspend
    0x157: 0x343B0, // sys_sigpending
    0x159: 0x344D0, // sys_sigtimedwait
    0x15A: 0x34110, // sys_sigwaitinfo
    0x16A: 0x346F0, // sys_kqueue
    0x16B: 0x32950, // sys_kevent
    0x17B: 0x328F0, // sys_mtypeprotect
    0x188: 0x32A10, // sys_uuidgen
    0x189: 0x34E60, // sys_sendfile
    0x18D: 0x32EB0, // sys_fstatfs
    0x190: 0x32A70, // sys_ksem_close
    0x191: 0x33800, // sys_ksem_post
    0x192: 0x340A0, // sys_ksem_wait
    0x193: 0x34E40, // sys_ksem_trywait
    0x194: 0x32BB0, // sys_ksem_init
    0x195: 0x345D0, // sys_ksem_open
    0x196: 0x342B0, // sys_ksem_unlink
    0x197: 0x32A30, // sys_ksem_getvalue
    0x198: 0x34270, // sys_ksem_destroy
    0x1A0: 0x34750, // sys_sigaction
    0x1A1: 0x343F0, // sys_sigreturn
    0x1A5: 0x330D0, // sys_getcontext
    0x1A6: 0x33E00, // sys_setcontext
    0x1A7: 0x33F20, // sys_swapcontext
    0x1AD: 0x33120, // sys_sigwait
    0x1AE: 0x327F0, // sys_thr_create
    0x1AF: 0x32B50, // sys_thr_exit
    0x1B0: 0x334F0, // sys_thr_self
    0x1B1: 0x32B70, // sys_thr_kill
    0x1B9: 0x34190, // sys_ksem_timedwait
    0x1BA: 0x324C0, // sys_thr_suspend
    0x1BB: 0x32DF0, // sys_thr_wake
    0x1BC: 0x33E60, // sys_kldunloadf
    0x1C6: 0x34B50, // sys__umtx_op
    0x1C7: 0x34890, // sys_thr_new
    0x1C8: 0x347F0, // sys_sigqueue
    0x1D0: 0x34150, // sys_thr_set_name
    0x1D2: 0x33700, // sys_rtprio_thread
    0x1DB: 0x32E90, // sys_pread
    0x1DC: 0x33FA0, // sys_pwrite
    0x1DD: 0x34870, // sys_mmap
    0x1DE: 0x34370, // sys_lseek
    0x1DF: 0x33410, // sys_truncate
    0x1E0: 0x32E70, // sys_ftruncate
    0x1E1: 0x32460, // sys_thr_kill2
    0x1E2: 0x34DE0, // sys_shm_open
    0x1E3: 0x34850, // sys_shm_unlink
    0x1E6: 0x33090, // sys_cpuset_getid
    0x1E7: 0x34C50, // sys_cpuset_getaffinity
    0x1E8: 0x34410, // sys_cpuset_setaffinity
    0x1F3: 0x32830, // sys_openat
    0x203: 0x33EE0, // sys___cap_rights_get
    0x20A: 0x33920, // sys_pselect
    0x214: 0x339E0, // sys_regmgr_call
    0x215: 0x33760, // sys_jitshm_create
    0x216: 0x33D40, // sys_jitshm_alias
    0x217: 0x32C30, // sys_dl_get_list
    0x218: 0x33A80, // sys_dl_get_info
    0x21A: 0x339C0, // sys_evf_create
    0x21B: 0x32E10, // sys_evf_delete
    0x21C: 0x33D60, // sys_evf_open
    0x21D: 0x33940, // sys_evf_close
    0x21E: 0x33C00, // sys_evf_wait
    0x21F: 0x343D0, // sys_evf_trywait
    0x220: 0x33D80, // sys_evf_set
    0x221: 0x342F0, // sys_evf_clear
    0x222: 0x33100, // sys_evf_cancel
    0x223: 0x33BE0, // sys_query_memory_protection
    0x224: 0x334D0, // sys_batch_map
    0x225: 0x336E0, // sys_osem_create
    0x226: 0x326B0, // sys_osem_delete
    0x227: 0x32630, // sys_osem_open
    0x228: 0x34C30, // sys_osem_close
    0x229: 0x33CC0, // sys_osem_wait
    0x22A: 0x342D0, // sys_osem_trywait
    0x22B: 0x33F60, // sys_osem_post
    0x22C: 0x33840, // sys_osem_cancel
    0x22D: 0x335F0, // sys_namedobj_create
    0x22E: 0x332F0, // sys_namedobj_delete
    0x22F: 0x34EC0, // sys_set_vm_container
    0x230: 0x32DB0, // sys_debug_init
    0x233: 0x33720, // sys_opmc_enable
    0x234: 0x32790, // sys_opmc_disable
    0x235: 0x337A0, // sys_opmc_set_ctl
    0x236: 0x337C0, // sys_opmc_set_ctr
    0x237: 0x34210, // sys_opmc_get_ctr
    0x23C: 0x33030, // sys_virtual_query
    0x249: 0x34650, // sys_is_in_sandbox
    0x24A: 0x33210, // sys_dmem_container
    0x24B: 0x33AC0, // sys_get_authinfo
    0x24C: 0x32610, // sys_mname
    0x24F: 0x32C10, // sys_dynlib_dlsym
    0x250: 0x32F10, // sys_dynlib_get_list
    0x251: 0x349B0, // sys_dynlib_get_info
    0x252: 0x338C0, // sys_dynlib_load_prx
    0x253: 0x328B0, // sys_dynlib_unload_prx
    0x254: 0x34730, // sys_dynlib_do_copy_relocations
    0x256: 0x336C0, // sys_dynlib_get_proc_param
    0x257: 0x34A10, // sys_dynlib_process_needed_and_relocate
    0x258: 0x32480, // sys_sandbox_path
    0x259: 0x32FF0, // sys_mdbg_service
    0x25A: 0x33680, // sys_randomized_path
    0x25B: 0x344F0, // sys_rdup
    0x25C: 0x32AF0, // sys_dl_get_metadata
    0x25D: 0x33230, // sys_workaround8849
    0x25E: 0x329F0, // sys_is_development_mode
    0x25F: 0x33B60, // sys_get_self_auth_info
    0x260: 0x34E00, // sys_dynlib_get_info_ex
    0x262: 0x34EA0, // sys_budget_get_ptype
    0x263: 0x32D00, // sys_get_paging_stats_of_all_threads
    0x264: 0x34C10, // sys_get_proc_type_info
    0x265: 0x32420, // sys_get_resident_count
    0x267: 0x33780, // sys_get_resident_fmem_count
    0x268: 0x34830, // sys_thr_get_name
    0x269: 0x33E40, // sys_set_gpo
    0x26A: 0x33B40, // sys_get_paging_stats_of_all_objects
    0x26B: 0x32930, // sys_test_debug_rwmem
    0x26C: 0x32A50, // sys_free_stack
    0x26E: 0x32650, // sys_ipmimgr_call
    0x26F: 0x33AA0, // sys_get_gpo
    0x270: 0x34E80, // sys_get_vm_map_timestamp
    0x271: 0x34430, // sys_opmc_set_hw
    0x272: 0x32F70, // sys_opmc_get_hw
    0x273: 0x325F0, // sys_get_cpu_usage_all
    0x274: 0x33C60, // sys_mmap_dmem
    0x275: 0x33010, // sys_physhm_open
    0x276: 0x33820, // sys_physhm_unlink
    0x278: 0x34DC0, // sys_thr_suspend_ucontext
    0x279: 0x332B0, // sys_thr_resume_ucontext
    0x27A: 0x33270, // sys_thr_get_ucontext
    0x27B: 0x33370, // sys_thr_set_ucontext
    0x27C: 0x32FB0, // sys_set_timezone_info
    0x27D: 0x33D00, // sys_set_phys_fmem_limit
    0x27E: 0x330B0, // sys_utc_to_localtime
    0x27F: 0x34EE0, // sys_localtime_to_utc
    0x280: 0x34060, // sys_set_uevt
    0x281: 0x32BD0, // sys_get_cpu_usage_proc
    0x282: 0x33450, // sys_get_map_statistics
    0x283: 0x341F0, // sys_set_chicken_switches
    0x286: 0x34B10, // sys_get_kernel_mem_statistics
    0x287: 0x33D20, // sys_get_sdk_compiled_version
    0x288: 0x32690, // sys_app_state_change
    0x289: 0x348B0, // sys_dynlib_get_obj_member
    0x28C: 0x32730, // sys_process_terminate
    0x28D: 0x32EF0, // sys_blockpool_open
    0x28E: 0x32C90, // sys_blockpool_map
    0x28F: 0x346D0, // sys_blockpool_unmap
    0x290: 0x34310, // sys_dynlib_get_info_for_libdbg
    0x291: 0x333D0, // sys_blockpool_batch
    0x292: 0x32B30, // sys_fdatasync
    0x293: 0x33050, // sys_dynlib_get_list2
    0x294: 0x34DA0, // sys_dynlib_get_info2
    0x295: 0x34550, // sys_aio_submit
    0x296: 0x32AD0, // sys_aio_multi_delete
    0x297: 0x33900, // sys_aio_multi_wait
    0x298: 0x329B0, // sys_aio_multi_poll
    0x299: 0x34450, // sys_aio_get_data
    0x29A: 0x338E0, // sys_aio_multi_cancel
    0x29B: 0x32890, // sys_get_bio_usage_all
    0x29C: 0x33F80, // sys_aio_create
    0x29D: 0x349F0, // sys_aio_submit_cmd
    0x29E: 0x348F0, // sys_aio_init
    0x29F: 0x34350, // sys_get_page_table_stats
    0x2A0: 0x347B0, // sys_dynlib_get_list_for_libdbg
    0x2A1: 0x34950, // sys_blockpool_move
    0x2A2: 0x347D0, // sys_virtual_query_all
    0x2A3: 0x33880, // sys_reserve_2mb_page
    0x2A4: 0x34130, // sys_cpumode_yield
    0x2A5: 0x33C40, // sys_wait6
    0x2A6: 0x336A0, // sys_cap_rights_limit
    0x2A7: 0x32C70, // sys_cap_ioctls_limit
    0x2A8: 0x339A0, // sys_cap_ioctls_get
    0x2A9: 0x34170, // sys_cap_fcntls_limit
    0x2AA: 0x32910, // sys_cap_fcntls_get
    0x2AB: 0x34C70, // sys_bindat
    0x2AC: 0x33470, // sys_connectat
    0x2AD: 0x326D0, // sys_chflagsat
    0x2AE: 0x32520, // sys_accept4
    0x2AF: 0x32B10, // sys_pipe2
    0x2B0: 0x33510, // sys_aio_mlock
    0x2B1: 0x34BF0, // sys_procctl
    0x2B2: 0x33EA0, // sys_ppoll
    0x2B3: 0x33DE0, // sys_futimens
    0x2B4: 0x34590, // sys_utimensat
    0x2B5: 0x33B00, // sys_numa_getaffinity
    0x2B6: 0x33960, // sys_numa_setaffinity
    0x2C1: 0x32970, // sys_get_phys_page_size
    0x2C9: 0x34BD0, // sys_get_ppr_sdk_compiled_version
    0x2CC: 0x331B0, // sys_openintr
    0x2CD: 0x33CA0, // sys_dl_get_info_2
    0x2CE: 0x33290, // sys_acinfo_add
    0x2CF: 0x32500, // sys_acinfo_delete
    0x2D0: 0x34530, // sys_acinfo_get_all_for_coredump
    0x2D1: 0x345F0, // sys_ampr_ctrl_debug
    0x2D2: 0x32750, // sys_workspace_ctrl
};

// Kernel stack offsets
const OFFSET_KERNEL_STACK_COOKIE                = 0x00000930;
const OFFSET_KERNEL_STACK_SYS_SCHED_YIELD_RET   = 0x00000808;

// Kernel text-relative offsets
const OFFSET_KERNEL_DATA                        = 0x00BD0000;
const OFFSET_KERNEL_SYS_SCHED_YIELD_RET         = 0x00559AD2;
const OFFSET_KERNEL_ALLPROC                     = 0x0333DC58;
const OFFSET_KERNEL_SECURITY_FLAGS              = 0x07036474;
const OFFSET_KERNEL_TARGETID                    = 0x0703647D;
const OFFSET_KERNEL_QA_FLAGS                    = 0x07036498;
const OFFSET_KERNEL_UTOKEN_FLAGS                = 0x07036500;
const OFFSET_KERNEL_PRISON0                     = 0x02892670;
const OFFSET_KERNEL_ROOTVNODE                   = 0x0737B4C0;

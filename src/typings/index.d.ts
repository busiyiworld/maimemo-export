export type Word = {
  vc_vocabulary: string
  list?: string
  order?: number
}

export type ExportOpt = {
  types?: ("txt" | "csv" | "list")[]
  dir?: string
  memorized?:
    | {
        type: "memorized" | "unmemorized"
        data: string[]
      }
    | string[]
    | false
  word?: "word" | "phrase" | boolean
  override?: boolean
  bookOpt?: BookOption
}

export type BookOption = {
  order?: "initials" | "book"
  reverse?: boolean
}
// 背过的单词
//     lsr_uid: 4435934,
//     lsr_new_voc_id: '5715eba984b77fda7e09c6ed',
//     lsr_voc_id: 611037,
//     lsr_frequency: 0.298216313123703,
//     lsr_fm: 0,
//     lsr_fm_history_byday: '0',
//     lsr_last_interval: 0,
//     lsr_interval_history_byday: '0',
//     lsr_last_response: 0,
//     lsr_response_history_byday: '0',
//     lsr_first_study_date: '20211023000000',
//     lsr_last_study_date: '20211023000000',
//     lsr_next_study_date: '20211023000000',
//     lsr_blocked_code: 1,
//     lsr_is_blocked_inDSR: 1,
//     lsr_been_blocked: 0,
//     lsr_block_date: '20211023000000',
//     lsr_is_new: 1,
//     lsr_study_method: 1,
//     lsr_add_date: '20190506000000',
//     lsr_add_order: 784,
//     lsr_last_real_interval: 0,
//     lsr_real_interval_history_byday: '0',
//     lsr_last_difficulty: -99,
//     lsr_last_is_matrix: -99,
//     lsr_last_matrix_version: -99,
//     lsr_last_scheduler_version: -99,
//     vc_id: '5715eba984b77fda7e09c6ed',
//     original_id: 611037,
//     vc_vocabulary: 'bittersweet',
//     vc_initial: '',
//     vc_phonetic_uk: '[ˈbɪtəswi:t]',
//     vc_phonetic_us: '[ˈbɪtəˌswit]',
//     vc_interpretation: 'kaqCkVtxkVbNkkl4kkzLkkl4ssU7r/Sq/8FYc8caWSFYcBIh6cdv',
//     vc_pronunciation: '',
//     vc_frequency: 0.2982163125195757,
//     vc_difficulty: 1,
//     vc_phrase: 0,
//     vc_updated_time: 0,
//     vc_study_user_count: 12471,
//     vc_acknowledge_rate: 0.585625,
//     status: null
//   },

// 本地词库
// {
//   vc_id: '57067c9fa172044907c670e5',
//   original_id: 661419,
//   vc_vocabulary: 'in public',
//   vc_initial: '',
//   vc_phonetic_uk: '[ɪn ˈpʌblɪk]',
//   vc_phonetic_us: '[ɪn ˈpʌblɪk]',
//   vc_interpretation: 'ssU7k7bTkaUOkZUu/8FIm8Fjn+iJaqIu6+/v',
//   vc_pronunciation: '',
//   vc_frequency: 0.6226146276165674,
//   vc_difficulty: 2,
//   vc_phrase: 0,
//   vc_updated_time: 0,
//   vc_study_user_count: 2245795,
//   vc_acknowledge_rate: 0.874982,
//   status: null,
//   list: '高频词汇 Unit 01',
//   voc_id: 661419,
//   chapter_id: 62165,
//   order: 23
// }

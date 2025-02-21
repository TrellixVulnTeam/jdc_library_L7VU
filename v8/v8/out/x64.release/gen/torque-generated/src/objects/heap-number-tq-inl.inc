template <class D, class P>
double TorqueGeneratedHeapNumber<D, P>::value() const {
  return this->template ReadField<double>(kValueOffset);
}
template <class D, class P>
void TorqueGeneratedHeapNumber<D, P>::set_value(double value) {
  this->template WriteField<double>(kValueOffset, value);
}

template<class D, class P>
inline TorqueGeneratedHeapNumber<D, P>::TorqueGeneratedHeapNumber(Address ptr)
  : P(ptr) {
  SLOW_DCHECK(IsHeapNumber_NonInline(*this));
}
template<class D, class P>
inline TorqueGeneratedHeapNumber<D, P>::TorqueGeneratedHeapNumber(Address ptr, HeapObject::AllowInlineSmiStorage allow_smi)
  : P(ptr, allow_smi) {
  SLOW_DCHECK((allow_smi == HeapObject::AllowInlineSmiStorage::kAllowBeingASmi && this->IsSmi()) || IsHeapNumber_NonInline(*this));
}

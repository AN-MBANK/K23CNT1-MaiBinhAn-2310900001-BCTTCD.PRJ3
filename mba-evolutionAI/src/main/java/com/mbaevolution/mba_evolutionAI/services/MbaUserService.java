package com.mbaevolution.mba_evolutionAI.services;

import com.mbaevolution.mba_evolutionAI.entity.MbaUser;
import com.mbaevolution.mba_evolutionAI.repository.MbaUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class MbaUserService {

    @Autowired
    private MbaUserRepository userRepository;

    /**
     * Tìm kiếm người dùng theo tên đăng nhập.
     */
    public Optional<MbaUser> findByUsername(String username) {
        return userRepository.findByMbaUsername(username);
    }

    /**
     * Xử lý logic đăng ký người dùng mới.
     * Lưu ý: Trong thực tế, bạn phải mã hóa mật khẩu ở đây (dùng BCryptPasswordEncoder).
     */
    @Transactional
    public MbaUser registerNewUser(String username, String password, String fullName, String email) {
        // Kiểm tra xem người dùng đã tồn tại hay chưa
        if (userRepository.findByMbaUsername(username).isPresent()) {
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại.");
        }

        MbaUser newUser = new MbaUser();
        newUser.setMbaUsername(username);
        newUser.setMbaUserPassword(password); // Cần mã hóa trong môi trường thực tế
        newUser.setMbaUserFullName(fullName);
        newUser.setMbaUserEmail(email);
        newUser.setMbaRole("USER"); // Mặc định là người dùng thông thường

        return userRepository.save(newUser);
    }

    /**
     * Xác thực thông tin đăng nhập.
     * @param username Tên đăng nhập
     * @param password Mật khẩu thô (chưa mã hóa)
     * @return Optional chứa User nếu xác thực thành công, hoặc rỗng nếu thất bại.
     */
    public Optional<MbaUser> authenticate(String username, String password) {
        Optional<MbaUser> userOptional = userRepository.findByMbaUsername(username);

        if (userOptional.isPresent()) {
            MbaUser user = userOptional.get();
            // Trong thực tế, dùng if (passwordEncoder.matches(password, user.getPassword()))
            if (user.getMbaUserPassword().equals(password)) {
                return userOptional;
            }
        }
        return Optional.empty();
    }
}